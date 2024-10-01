package websockets

import (
	"github.com/VibeMerchants/StudyBuddies/model"
	"github.com/redis/go-redis/v9"
)

type Hub struct {
	clients     map[*Client]bool
	register    chan *Client
	unregister  chan *Client
	broadcast   chan []byte
	pools       map[*Pool]bool
	userService model.UserService
	redisClient *redis.Client
}

type Config struct {
	UserService model.UserService
	RedisClient *redis.Client
}

func NewHub(config *Config) *Hub {
	return &Hub{
		clients:     make(map[*Client]bool),
		register:    make(chan *Client),
		unregister:  make(chan *Client),
		broadcast:   make(chan []byte),
		userService: config.UserService,
		redisClient: config.RedisClient,
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
		case message := <-h.broadcast:
			h.broadcastMessageToClients(message)
		}
	}
}

func (h *Hub) registerClient(client *Client) {
	h.clients[client] = true
}

func (h *Hub) unregisterClient(client *Client) {
	if _, ok := h.clients[client]; ok {
		delete(h.clients, client)
		close(client.send)
	}
}

func (h *Hub) broadcastMessageToClients(message []byte) {
	for client := range h.clients {
		client.send <- message
	}
}

func (h *Hub) BroadcastMessageToPool(message []byte, id string) {
	if pool := h.getPool(id); pool != nil {
		pool.publishMessage(message)
	}
}

func (h *Hub) getPool(id string) *Pool {
	for pool := range h.pools {
		if pool.getId() == id {
			return pool
		}
	}
	return nil
}

func (h *Hub) createPool(id string) *Pool {
	pool := NewPool(id, h.redisClient)
	go pool.Run()
	h.pools[pool] = true
	return pool
}
