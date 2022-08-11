const { PORT = 4999 } = process.env;
const app = require("./app");
const morgan = require("morgan");

// prints to the browser
const sayHello = (req, res, next) => {
    console.log(req.query);
    const name = req.query.name;
    const content = name ? `Hello, ${name}!` : "Hello!"
    res.send(content)
};

const saySomething = (req, res) => {
    const greeting = req.params.greeting;
    const name = req.query.name;

    const content = greeting && name ? `${greeting}, ${name}!` : `${greeting}`;
    res.send(content)
}

const checkForAbbreviationLength = (req, res, next) => {
    const abbreviation = req.params.abbreviation;
    if (abbreviation !== 2) {
        next(`State abbreviation is invalid.`)
    } else {
        next()
    }
};

// reports broswer request activity
app.use(morgan("dev"));

app.get(
    "/states/:abbreviation",
    checkForAbbreviationLength, 
    (req, res, next) => {
        res.send(`${abbreviation} is a nice state, I'd like to visit it someday.`)
    }
)
app.get(
    "/travel/:abbreviation", 
    checkForAbbreviationLength,
    (req, res, next) => {  
        res.send(`Enjoy you trup to ${abbreviation}!`)
    }
);
// not-found error handler
app.use((req, res, next) => {
    res.send(`The route ${req.path} does not exist!`)
}) 
// error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.send(err)
})
app.get("/hello", sayHello);
app.get("/say/:greeting", saySomething)

const listener = () => console.log(`Listening on Port ${PORT}!`);
app.listen(PORT, listener)