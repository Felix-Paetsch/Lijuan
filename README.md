# Lijuan

The goal of this project is to create a starting enviroment for any Server Based software project I might want to write. 
It's aim is to have many modular components like a website, database and discord bot wich can interact with each other via an event manager.

Each module is expected to have a `hook.js` file which exports a function

```js
export default (event_manager) => {
    console.log("Hi");
}
```

## Moduels
The different modules ...

descr, dependency

## Modules todo
- JSON database
- error logging for each different part

## Todo:
Make .json files visible/give a nice template for others
.gitkeep files in the correct dirs

Make features like scss support optional
Make flow to initialize project

Good JDB interface && design
How to do better callbacks for DB, error handling?

Make a default APP
Implement Alpine/HTMX
(later maybe dev-start, but we will see)

Figure out a better solution for try_respond, maybe using the next() functionality
Figure out the deal with ejs responses

Tech we use:

- Scss (evt put CSS into gitignore?) Maybe /scss folder in resources and ignore css in - scss / views folders?
- Express + EJS
- Alpine.js + Next.js

How much is views in the accessible routes?
Default Favicon? Robots.txt? well-known?
Handle DB Errors better

Clean Up website && Make simple example program.. which components are supposed to be edited, which not?
Probably... only website???

