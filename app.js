var createError = require("http-errors")
var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")

var indexRouter = require("./routes/index")
var usersRouter = require("./routes/users")

var app = express()

//app.use(express.static(path.join(__dirname, "build")))

//app.get("/react", (req, res) => {
//  res.sendFile(path.join(__dirname, "build", "index.html"))
//})

// view engine setup
// app.set("views", path.join(__dirname, "views"))
// app.set("view engine", "jade")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/", indexRouter)
app.use("/users", usersRouter)


app.get('/jobs', async (req, res) => {
  try {
    let { description = '', full_time, location = '', page = 1 } = req.query;

    description = description ? encodeURIComponent(description) : '';
    location = location ? encodeURIComponent(location) : '';
    full_time = full_time === 'true' ? '&full_time=true' : '';
    if (page) {
      page = parseInt(page);
      page = isNaN(page) ? '' : `&page=${page}`;
    }
    const query = `https://jobs.github.com/positions.json?description=${description}&location=${location}${full_time}${page}`;
    const result = await axios.get(query);
    res.send(result.data);
  } catch (error) {
    res.status(400).send('Error while getting list of jobs.Try again later.');
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

app.use(express.static(path.resolve(__dirname, './src')));

app.get('*', function (request, response) {
  const filePath = path.resolve(__dirname, './src', 'index.html');
  response.sendFile(filePath);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

module.exports = app
