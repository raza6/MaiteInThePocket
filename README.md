# Maite in the Pocket
<div align="center">

  ![buildApp](https://img.shields.io/github/actions/workflow/status/raza6/MaiteInThePocket/build.yml?label=app%20build)
  ![app](https://img.shields.io/website?label=app&up_message=online&url=https%3A%2F%2Fmaite.raza6.fr%2Fapp)
  ![api](https://img.shields.io/website?label=api&up_message=online&url=https%3A%2F%2Fmaite.raza6.fr%2Fmp%2Ftest)

</div>

Maite in the Pocket is an online cookbook application.

## Installation

The project is split in two parts: **server** and **app**.

Install both projects using `npm install` in both folders `src/server` and `src/app`.

Additionnaly, a **MongoDB** server needs to be available with a database named `MaiteInThePocket`. Then execute the script `src/docker/mongo-init.js` on that MongoDB server to create collections and indexes.

## Usage

To use the app locally:

In `src/server`, copy `.env.template` as `.env` and fill in the information.
Launch the server using `npm run dev` in the directory. You can check that the server is launched by requesting the `/mp/test` GET endpoint.

Launch the app using `npm run start` in the `src/app` directory. Make sure the API_URL constant is correct (`src/app/src/config.ts`). The app should automatically open in your browser of choice.

### Cross platform

This project uses [tauri](https://tauri.app/) to achieve **cross platform** compatibility. With a correct set-up of tauri, run `npm run tauri dev` to launch as a standalone app.

## Deployment

Cf. [DEPLOY.md](./DEPLOY.md)

## Authors and acknowledgment

Maite in the Pocket has been developed by [@raza6](https://github.com/raza6).

Both server and app are built with TypeScript.

Server :
  - [express](https://www.npmjs.com/package/express)
  - [mongodb](https://www.npmjs.com/package/mongodb)
  
App : 
  - [React](https://www.npmjs.com/package/react)
  - [Bootstrap](https://getbootstrap.com/)

## License

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode)