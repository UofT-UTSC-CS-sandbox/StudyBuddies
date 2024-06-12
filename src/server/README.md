# Getting the server running

## Prerequisites
- [Docker][docker]
- [Golang][go]
- [pgcli][pgcli]

[docker]: https://docs.docker.com/desktop/install/mac-install/
[go]: https://go.dev/doc/install
[pgcli]: https://www.pgcli.com/install

Go Ahead and install the above software

## Installing packages
Navigate to `src/server` and run `go mod tidy`

## Setting up postgres db via docker and linking it to server
In a new terminal:


1. Run `docker run --name postgres -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=password -d postgres:alpine` 
1. Confirm that the docker container exists by running `docker ps`
    - Output should look like the below:
    ``` bash
    CONTAINER ID   IMAGE             COMMAND                  CREATED       STATUS       PORTS                    NAMES
    <some alpha-nums string>   postgres:alpine   "docker-entrypoint.s…"   <1-3s>        <1-3s>   0.0.0.0:5432->5432/tcp   postgres
    ``` 
1. In the `src/server` directory:
    1. `touch .env`
    1. In your IDE, open the .env file and add the line: `DATABASE_URL=postgresql://root:password@localhost:5432/postgres`

## Running the server
1. In the `src/server` directory, run `go run github.com/VibeMerchants/StudyBuddies` 
1. Confirm output is similar to:
```bash
2024/06/12 13:15:36 Starting Server on port 8080
Database URL:  postgresql://root:password@localhost:5432/postgres
2024/06/12 13:15:36 Creating new data
[GIN-debug] [WARNING] Creating an Engine instance with the Logger and Recovery middleware already attached.

[GIN-debug] [WARNING] Running in "debug" mode. Switch to "release" mode in production.
 - using env:	export GIN_MODE=release
 - using code:	gin.SetMode(gin.ReleaseMode)

[GIN-debug] POST   /api/account/register     --> github.com/VibeMerchants/StudyBuddies/handlers.(*Handler).Register-fm (4 handlers)
[GIN-debug] POST   /api/account/auth/callback --> github.com/VibeMerchants/StudyBuddies/handlers.(*Handler).AuthCallbackHandler-fm (4 handlers)
```
