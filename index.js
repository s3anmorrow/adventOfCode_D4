const fs = require("fs");

function readInput() {
  const lineReader = require("readline").createInterface({
    input: require("fs").createReadStream("input.txt")
  });

  let log = [];
  lineReader
    .on("line", line => {
      log.push(line);
    })

    .on("close", () => {
      // sort by dates while the elements are still strings
      log.sort();      
      // map array to clean it
      log = log.map(element => {
        // cleaning up the string (too lazy to use regex)
        element = element.substring(element.indexOf("-") + 1);
        element = element.replace("] wakes up",",1");
        element = element.replace("] falls asleep",",0");
        element = element.replace("] Guard #",",");
        element = element.replace(" begins shift","");

        // dammit - can't get around it for this :(
        element = element.replace(/[-: ]/g,",");

        // make it a 2D array
        element = element.split(",");  

        // type converting to numbers
        //element[0] = Number(element[0]);
        //element[1] = Number(element[1]);
        element[2] = Number(element[2]);
        element[3] = Number(element[3]);
        element[4] = Number(element[4]);

        return element;
      });

      // log.forEach(e => {
      //   if (e[4] == 3257) {
      //     console.log("---------------------------");
      //   }
      //   console.log(e);
      // });

      // output report
      console.log("           000000000011111111112222222222333333333344444444445555555555");
      console.log("           012345678901234567890123456789012345678901234567890123456789");
      let output = "";   
      let data = [];      
      let guardID = -1;
      let sleepScores = {};
      let minuteScores = {};
      for (let entry=0; entry<log.length; entry++) {

        let [month, day, hour, minute, status] = log[entry];

        //console.log(guardStatus);
        if ((status !== 0) && (status !== 1)) {

          if (data.length > 0) {
            // add minutes output to report
            let counter = 0;
            let awake = true;
            for (let n=0; n<60; n++) {
              if (data[counter] == n) {
                awake = !awake;
                counter++;
              }
              if (awake) {
                output += ".";
              } else {
                output += "#"; 
                sleepScores[guardID]++;
                minuteScores[guardID][n]++;
              }
            }

            if (guardID == 3323) {
              console.log(output);
            }
          }

          // starting new shift
          output = "";
          data = [];
          guardID = status;
          if (sleepScores[guardID] === undefined) {
            sleepScores[guardID] = 0;
            minuteScores[guardID] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
          }

          output = `${month}-${day} ${String(status).length < 4 ? "0" + String(status) : status} `;

        } else if (status === 0) {
          // fall asleep log entry
          data.push(minute);
        } else if (status === 1) {
          // awake log entry
          data.push(minute);
        }
      }

      console.log(sleepScores);
      //console.log(minuteScores["983"]);
      for (let p=0; p<minuteScores["983"].length; p++) {
        console.log(p + " - " + minuteScores["983"][p]);
      }

    });
}

readInput();