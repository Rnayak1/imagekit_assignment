# Google Drive Mutation (simple UI)

A url shortener API made with NodeJS, ExpressJS, Passport and MongoDB

## Branches:

> Backend
> UI , place this folder inside backend to run properly

### Add File/Folder :

`POST /api/addContent`

### delete file/folder :

`POST /api/deleteContent`

### rename file/folder

`POST /api/mofidyContent`

> Note : working for files but not for folder at present so missing in UI

### search (file name/ partial search/ extension search )

`POST /api/getContent/search`

### Sort according to reverse creation time

`POST /api/getContent/reverse`

## Configuration

> create `.env` in bacnkend folder and add macro
>
> > DATABASE = mongodb://127.0.0.1/imageKit

## To run

> npm run client-install
> npm run dev
