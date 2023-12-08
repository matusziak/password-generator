const express = require("express");
var cors = require("cors");

const app = express();
const port = 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

function buildRegex(
  includeLowercase,
  includeUppercase,
  includeNumbers,
  includeSymbols
) {
  var regex = "";

  if (includeLowercase) {
    regex += "(?=.*[a-z])";
  }

  if (includeUppercase) {
    regex += "(?=.*[A-Z])";
  }

  if (includeNumbers) {
    regex += "(?=.*[0-9])";
  }

  if (includeSymbols) {
    regex += "(?=.*[!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~])";
  }

  return new RegExp("^" + regex);
}

app.get("/generate", (req, res) => {
  const length = req.query.length;

  if (!length) {
    res.status(400);
    res.send("Please specify password length");
  }

  const isLowercase = req.query.isLowercase === "true";
  const isUppercase = req.query.isUppercase === "true";
  const isNumbers = req.query.isNumbers === "true";
  const isSymbols = req.query.isSymbols === "true";

  console.log({ isLowercase });
  console.log({ isUppercase });
  console.log({ isNumbers });
  console.log({ isSymbols });

  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!\"#$%&'()*+,-./:;<=>?@[]^_`{|}~";

  const availableChars = [
    isLowercase ? lowercase.split("") : null,
    isUppercase ? uppercase.split("") : null,
    isNumbers ? numbers.split("") : null,
    isSymbols ? symbols.split("") : null,
  ].filter((arrayOrNull) => arrayOrNull !== null);

  if (availableChars.length === 0) {
    res.status(400);
    res.send("Please allow at least one of the available character groups");
  }

  const getPassword = () => {
    let password;
    const usedChars = [];

    let passedValidation = false;
    while (!passedValidation) {
      password = [];
      for (let i = 0; i < length; i++) {
        const chosenCharArray =
          Math.floor(Math.random() * 100) % availableChars.length;
        const randomIndex = Math.floor(Math.random() * 100);

        usedCharsIndex = randomIndex % availableChars[chosenCharArray].length;

        usedChars.push(usedCharsIndex);
        password.push(availableChars[chosenCharArray][usedCharsIndex]);
      }

      const regexPattern = buildRegex(
        isLowercase,
        isUppercase,
        isNumbers,
        isSymbols
      );

      console.log(regexPattern);

      passedValidation = regexPattern.test(password.join(""));
      console.log({ passedValidation });
      console.log({ password });
    }

    return password.join("");
  };

  res.send(getPassword());
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
