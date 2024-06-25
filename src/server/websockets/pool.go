package websockets

import (
	"context"
	"fmt"

	"github.com/VibeMerchants/StudyBuddies/model"
	"github.com/redis/go-redis/v9"
)

type Pool struct {
	id         string
	clients    map[*Client]bool
	register   chan *Client
	unregister chan *Client
	broadcast  chan *model.WebsocketMessage
	redis      *redis.Client
}

var ctx = context.Background()

func NewPool(id string, r *redis.Client) *Pool {
	return &Pool{
		id:         id,
		clients:    make(map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		broadcast:  make(chan *model.WebsocketMessage),
		redis:      r,
	}
}

func (p *Pool) Run() {
	go p.subscribeToPool()
	for {
		select {
		case client := <-p.register:
			p.registerClient(client)
		case client := <-p.unregister:
			p.unregisterClient(client)
		case message := <-p.broadcast:
			p.publishMessage(message.EncodeAsBytes())
		}
	}
}

func (p *Pool) registerClient(client *Client) {
	p.clients[client] = true
}

func (p *Pool) unregisterClient(client *Client) {
	if _, ok := p.clients[client]; ok {
		delete(p.clients, client)
		close(client.send)
	}
}

func (p *Pool) getId() string {
	return p.id
}

func (p *Pool) publishMessage(message []byte) {
	err := p.redis.Publish(ctx, p.id, message).Err()
	if err != nil {
		fmt.Println(err)
	}
}

func (p *Pool) broadcastMessageToClients(message []byte) {
	for client := range p.clients {
		client.send <- message
	}
}

func (p *Pool) subscribeToPool() {
	pubsub := p.redis.Subscribe(ctx, p.getId())

	ch := pubsub.Channel()

	for msg := range ch {
		p.broadcastMessageToClients([]byte(msg.Payload))

	}
}
