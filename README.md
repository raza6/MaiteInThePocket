# Maite in the Pocket

Maite in the Pocket is an online cookbook application.

## Installation

The project is split in two parts: **server** and **app**.

Install both projects using `npm install` in both folders `src/server` and `src/app`.

Additionnaly a **MongoDB** server needs to be available with a database named `MaiteInThePocket`. Then execute the script `src/docker/mongo-init.js` on that MongoDB server to create collections and indexes.

### Cross platform

This project uses [tauri](https://tauri.app/) to achieve **cross platform** compatibility. With a correct set-up of tauri, run `npm run tauri dev` to launch as a standalone app.

## Usage

To use the app locally:

In `src/server`, copy `.env.template` as `.env` and fill in the information.
Launch the server using `npm run start` in the directory. You can check that the server is launched by requesting the `/mp/test` GET endpoint.

Launch the app using `npm run start` in the `src/app` directory. Make sure the API_URL constant is correct (`src/app/services/mainServices.ts`). The app should automatically open in your browser of choice.

## Deployment

Cf. [DEPLOY.md](./DEPLOY.md)

## Authors and acknowledgment

Maite in the Pocket has been developed by [@raza6](https://github.com/raza6).

Both server and app are based on Node.js using TypeScript. The server part is mostly based on [express](https://www.npmjs.com/package/express) and [mongodb](https://www.npmjs.com/package/mongodb). The app part is a [React](https://www.npmjs.com/package/react) project with [Bootstrap](https://getbootstrap.com/) for quick styling.

## License

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode)