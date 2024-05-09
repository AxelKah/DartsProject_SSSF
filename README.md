# DartsProject SSSF

## Description
This is a project for Server-Side Scripting course that focuses on building a Darts scoring application.

## Project Idea
This app's idea is to allow you to play darts online against your friends from the comfort of your own home.

## Target audiance
The target audiance for this app is people who owns a Darts board and would like to play darts against their friends without physically being at the same place.

## Features
- Login / Register
- Score tracking for multiple players
- Game mode (501)
- User-friendly interface
- Ability to send and receive chat messages with opponent in the same room
- Only 2 clients can connect to one room
- Game results are saved to DB

## Local Installation
1. Clone the repository: `git clone https://github.com/AxelKah/DartsProject_SSSF.git`
2. Clone Frontend repository: `git clone https://github.com/AxelKah/DartsFrontVite`
3. Clone Socket server repository:`git clone https://github.com/AxelKah/ssf-socket-server.git`
4. Clone Auth server repository: `git clone https://github.com/AxelKah/sssf-24-auth-server`
5. Navigate to the project directories (example): `cd DartsProject_SSSF`
6. Install the dependencies: `npm install` do this for all the cloned repositories
7. Setup .env file(use .env.sample as a template)

>   NODE_ENV=development
>   PORT=3000
>   DATABASE_URL= (Add your own MongoDB link)
>   JWT_SECRET (Add your own secret)
>   AUTH_URL=http://localhost:3001/api/v1
>   UPLOAD_URL=http://localhost:3002/api/v1
>   SOCKET_URL=http://localhost:3003

8. Run `npm run dev` for all the repositories (Backend, Frontend, Auth, Socket)


## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.