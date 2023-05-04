//--- These function will interact with the browser sessionStorage, which act as a db for this project
//---added timeout for fake pending effect----

export const insertData = (json) => {
  return new Promise((resolve, reject) => {
    let validation = validate(json);
    if (!validation.passed) {
      reject({ msg: validation.msg });
    } else {
      let data = sessionStorage.getItem("revenueGroup");
      setTimeout(() => {
        if (data) {
          data = JSON.parse(data);
          sessionStorage.setItem(
            "revenueGroup",
            JSON.stringify([...data, json])
          );
          resolve({
            msg: "New group created successfully",
            data: [...data, json],
          });
        } else {
          sessionStorage.setItem("revenueGroup", JSON.stringify([json]));
          resolve({ msg: "New group created successfully", data: [json] });
        }

        //reject({ msg: "Incorrect Password" });
      }, 1000);
    }
  });
};

export const getData = () => {
  return new Promise((resolve, reject) => {
    let data = sessionStorage.getItem("revenueGroup");

    setTimeout(() => {
      if (data != undefined || data) {
        resolve({
          status: "ok",
          msg: "Data found!",
          data: JSON.parse(data),
        });
      } else reject({ msg: "Data not found" });
    }, 1000);
  });
};

export const updateData = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      sessionStorage.setItem("revenueGroup", JSON.stringify(data));
      resolve({ msg: "Updated" });
    }, 1000);
  });
};

const validate = (data) => {
  if (!data.name) {
    return { passed: false, msg: "Group name cannot be empty" };
  }
  if (!data.description) {
    return { passed: false, msg: "Group description cannot be empty" };
  }

  if (data.rules.length <= 0) {
    return { passed: false, msg: "Please add at least one rule" };
  }

  for (let i = 0; i < data.rules.length; i++) {
    if (data.rules[i].field == "") {
      return { passed: false, msg: `Please select field in rule ${i + 1}` };
    }
    if (data.rules[i].operator == "") {
      return {
        passed: false,
        msg: `Please select operator in rule ${i + 1}`,
      };
    }
    if (data.rules[i].params.includes("")) {
      return { passed: false, msg: `Empty param found in rule ${i + 1}` };
    }
    if (data.rules[i].revenue <= 0 || data.rules[i].revenue > 100) {
      return {
        passed: false,
        msg: `Please enter valid revenue amount (1-100) in rule ${i + 1}`,
      };
    }
  }

  return { passed: true };
};
