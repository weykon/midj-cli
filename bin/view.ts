import blessed from "blessed";
namespace View {
  const screen = blessed.screen({
    smartCSR: true,
  });
  screen.title = "MIDJ TOOL";

  function login_pannel() {
    const login_box = blessed.box({
      top: "center",
      left: "center",
      width: "80%",
      height: "90%",
      content: "{bold}LOGIN!!!{/bold}!",
      tags: true,
      border: {
        type: "line",
      },
      style: {
        fg: "white",
        bg: "magenta",
        border: {
          fg: "#f0f0f0",
        },
      },
    });
    const login_box_url_input_title = blessed.text({
      parent: login_box,
      top: 2,
      valign: "middle",
      "content": "URL",
      shrink: true,
      name: "URL",
    });
    const login_box_url_input = blessed.textbox({
      parent: login_box,
      mouse: true,
      keys: true,
      top: 2,
      left: 3,
      right: 2,
      shrink: true,
      name: "login_box_url_input",
      style: {
        bg: "grey",
      },
      inputOnFocus: true,
      vi: true,
    });
    const login_box_token_input_title = blessed.text({
      parent: login_box,
      top: 4,
      valign: "middle",
      "content": "token",
      shrink: true,
      name: "URL",
    });
    const login_box_token_input = blessed.textbox({
      parent: login_box,
      mouse: true,
      keys: true,
      top: 4,
      left: 5,
      right: 2,
      shrink: true,
      name: "input",
      content: "type here",
      style: {
        bg: "grey",
      },
    });
    const login_box_login_button = blessed.button({
      "parent": login_box,
      "mouse": true,
      "keys": true,
      "top": 6,
      left: 7,
      "align": "center",
      "shrink": true,
      "name": "login_box_login_button",
      "content": "login",
      "style": {},
    });
    screen.append(login_box);
    screen.key(["escape", "q", "C-c"], function (ch, key) {
      return process.exit(0);
    });
    login_box_url_input.on("press", () => void login_box_url_input.focus());

    login_box.focus();
  }

  function main_pannel() {
    blessed.box({
      parent: screen,
      top: "left",
      width: "20%",
      height: "100%",
      bg: "green",

    });
  }
  login_pannel()
//   main_pannel();
  screen.render();
}
