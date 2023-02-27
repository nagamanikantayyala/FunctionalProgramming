import { curry, ifElse, isEmpty, pipe, tap, trim, tryCatch, when } from "ramda";

const consoleInput = document.querySelector(".console-input");
const historyContainer = document.querySelector(".console-history");
const addResult = curry((inputAsString, output) => {
  const outputAsString =
    output instanceof Array ? `[${output.join(", ")}]` : output.toString();
  const inputLogElement = document.createElement("div");
  const outputLogElement = document.createElement("div");

  inputLogElement.classList.add("console-input-log");
  outputLogElement.classList.add("console-output-log");

  inputLogElement.textContent = `> ${inputAsString}`;
  outputLogElement.textContent = outputAsString;

  historyContainer.append(inputLogElement, outputLogElement);
});

const resetInput = () => {
  consoleInput.value = "";
  historyContainer.scrollTop = historyContainer.scrollHeight;
};
const code = (consoleInput) => trim(consoleInput.value);
consoleInput.addEventListener("keyup", (e) => {
  pipe(
    code,
    tap(console.log),
    ifElse(
      (str) => isEmpty(str),
      () => {
        console.log("error");
      },
      (str) => {
        when(
          () => e.key === "Enter",
          () => {
            tryCatch(
              () => addResult(str)(eval(str)),
              (error) => addResult(str)(error)
            )();
            resetInput();
          }
        )(str);
      }
    )
  )(consoleInput);
});
