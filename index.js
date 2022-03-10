const express = require("express");
const app = express();

function debug(_req, _res, next) {
	console.log("Request received");
	next();
}

app.use(express.json(),debug);

const superHeros = [
	{
		name: "Iron Man",
		power: ["money"],
		color: "red",
		isAlive: false,
		age: 46,
		image: "https://blog.fr.playstation.com/tachyon/sites/10/2019/07/unnamed-file-18.jpg?resize=1088,500&crop_strategy=smart",
	},
	{
		name: "Thor",
		power: ["electricity", "worthy"],
		color: "blue",
		isAlive: true,
		age: 300,
		image: "https://www.bdfugue.com/media/catalog/product/cache/1/image/400x/17f82f742ffe127f42dca9de82fb58b1/9/7/9782809465761_1_75.jpg",
	},
	{
		name: "Daredevil",
		power: ["blind"],
		color: "red",
		isAlive: false,
		age: 30,
		image: "https://aws.vdkimg.com/film/2/5/1/1/251170_backdrop_scale_1280xauto.jpg",
	},
];

function findHero(req, _res, next) {
	const hero = superHeros.find((hero) => {
		return (
			req.params.name.toLowerCase().replace(" ", "-") ===
			hero.name.toLowerCase().replace(" ", "-")
		);
	});
	req.hero = hero;
	next();
}

app.get("/heroes", (_req, res) => {
	res.json(superHeros);
});

app.get("/heroes/:name", findHero, (req, res) => {
	res.json(req.hero);
});

app.get("/heroes/:name/powers", findHero, (req, res) => {
	res.json(req.hero.power);
});

function transformName(req, res, next) {
	if (req.body.name) {
		req.body.name = req.body.name.toLowerCase();
	}
	next();
}

app.post("/heroes", transformName, (req, res) => {
	superHeros.push(req.body);

	res.json({
		message: "Ok; hero ajouté",
		superHeros,
	});
});

app.patch("/heroes/:name/powers", findHero, (req, res) => {
	const hero = req.hero;

	hero.power.push(req.body.power);

	res.json({
		message: "Pouvoir ajouté",
		hero,
	});
});

app.use("*", (err, req, res, next) => {
	res.send("error");
});


app.listen(8000, () => {
    console.log("Listening on port 8000");
  });