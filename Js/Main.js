$(document).ready(function () {
  // Helpers
  function toInt(val) {
    const n = parseInt(String(val).replace(/[^\d-]/g, ""), 10);
    return isNaN(n) ? 0 : n;
  }

  function safeVal(selector) {
    return toInt($(selector).val());
  }

  function safeText(selector) {
    return toInt($(selector).text());
  }

  let percent = "0%";
  let lesson = "";
  let timeask = 0;
  let timeask2 = 0;

  const lessonpermison = []; // index by lesson number
  let finish = 0;

  // Calculate percent
  $("#percentcounter").click(function () {
    const correct = safeVal("#true");
    const wrong = safeVal("#false");
    const none = safeVal("#none");

    const sum = correct + wrong + none;

    if (sum !== 0) {
      const each = 100 / sum;
      const eachwrong = each / 3;
      const p = Math.floor(100 - none * each - wrong * each - wrong * eachwrong);
      percent = p + "%";
    } else {
      percent = "0%";
    }

    $("#percentval").text(percent);
    $("#scoreadder").css("visibility", "visible");
    timeask = 1;
  });

  // Any change clears percent & hides adder
  $("#true, #false, #none").on("change input", function () {
    if (timeask === 1) {
      $("#scoreadder").css("visibility", "hidden");
      $("#percentval").text("");
    }
  });

  // Add/Update subject row
  $("#scoreadder").click(function () {
    const lessonnum = toInt($("#lesson").children("option:selected").val());

    if (lessonnum <= 0) {
      alert("Please choose a subject!");
      return;
    }

    switch (lessonnum) {
      case 1:
        lesson = "Mathematics";
        break;
      case 2:
        lesson = "Chemistry";
        break;
      case 3:
        lesson = "Physics";
        break;
      case 4:
        lesson = "Geometry";
        break;
      case 5:
        lesson = "English";
        break;
      case 6:
        lesson = "Biology";
        break;
      case 7:
        lesson = "PE";
        break;
      default:
        lesson = "Subject";
    }

    const percentText = $("#percentval").text() || "0%";
    const t = safeVal("#true");
    const f = safeVal("#false");
    const n = safeVal("#none");

    // IMPORTANT: quote the id attribute in HTML to avoid edge issues
    if (lessonpermison[lessonnum] !== "full") {
      lessonpermison[lessonnum] = "full";
      $("#resultsheet").append(
        "<tr id='" +
          lessonnum +
          "'><td>" +
          lesson +
          "</td><td>" +
          percentText +
          "</td><td>" +
          t +
          "</td><td>" +
          f +
          "</td><td>" +
          n +
          "</td></tr>"
      );
      finish++;
    } else {
      $("#" + lessonnum).html(
        "<td>" +
          lesson +
          "</td><td>" +
          percentText +
          "</td><td>" +
          t +
          "</td><td>" +
          f +
          "</td><td>" +
          n +
          "</td>"
      );
    }
  });

  // Final row calculation
  $("#signscore").click(function () {
    if (finish !== 7) {
      alert("Please enter all subjects' scores!");
      return;
    }

    // Reset totals each time to avoid accumulating + NaN
    let pe = 0;
    let tr = 0;
    let fa = 0;
    let no = 0;

    // Rows are: header + 7 subjects => subject rows are nth-child 2..8
    for (let i = 1; i <= 7; i++) {
      const $row = $("#resultsheet tr:nth-child(" + (i + 1) + ")");

      // td:eq(1) is percent (e.g. "83%") -> toInt handles "%"
      pe += toInt($row.find("td:eq(1)").text());
      tr += toInt($row.find("td:eq(2)").text());
      fa += toInt($row.find("td:eq(3)").text());
      no += toInt($row.find("td:eq(4)").text());
    }

    pe = Math.floor(pe / 7);

    // Create/update the final row by ID (no fragile nth-child(9))
    const finalHtml =
      "<td>Final</td><td>" +
      pe +
      "%</td><td>" +
      tr +
      "</td><td>" +
      fa +
      "</td><td>" +
      no +
      "</td>";

    if ($("#sum").length) {
      $("#sum").html(finalHtml);
    } else {
      $("#resultsheet").append("<tr id='sum'>" + finalHtml + "</tr>");
    }

    timeask2 = 1;
  });
});
