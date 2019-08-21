import calculateAverageVelocity from "./calculateAverageVelocity";

/*
    This function calculates and insert daily velocity metrics
*/
const insertWeeklyVelocity = (calendar: any) => {
  const updatedCalendar = JSON.parse(JSON.stringify(calendar));
  let ticketsPerWeek: any = Object.values(updatedCalendar.weeks);

  let startIdx = 0;
  ticketsPerWeek.map((value: any, idx: number) => {
    // Rolling averages are calculates over a window of 4 weeks
    if (idx <= 4) {
      startIdx = 0;
    } else {
      startIdx = idx - 4;
    }
    if (idx !== 0) {
      /*
      console.log(
        "Weekly Velocity - Processing window: " +
          startIdx +
          " -> " +
          idx +
          ", from: " +
          ticketsPerWeek[startIdx].date +
          " to: " +
          ticketsPerWeek[idx].date
      );
      */
      let currentWindowIssues = ticketsPerWeek.slice(startIdx, idx);
      ticketsPerWeek[idx].completion.issues.velocity = calculateAverageVelocity(
        currentWindowIssues,
        "completion",
        "issues"
      );
      ticketsPerWeek[idx].completion.points.velocity = calculateAverageVelocity(
        currentWindowIssues,
        "completion",
        "points"
      );
      ticketsPerWeek[
        idx
      ].scopeChangeCompletion.issues.velocity = calculateAverageVelocity(
        currentWindowIssues,
        "scopeChangeCompletion",
        "issues"
      );
      ticketsPerWeek[
        idx
      ].scopeChangeCompletion.points.velocity = calculateAverageVelocity(
        currentWindowIssues,
        "scopeChangeCompletion",
        "points"
      );
    }
  });
  updatedCalendar["weeks"] = ticketsPerWeek;
  return updatedCalendar;
};

export default insertWeeklyVelocity;
