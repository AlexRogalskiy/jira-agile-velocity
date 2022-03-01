import { ICalendar, IJiraIssue } from '../../global';

const stringClean = (labelName: string) => {
  return String(labelName)
    .replace(' ', '')
    .replace(/[^a-z0-9+]+/gi, '')
    .toLowerCase();
};

/*
    Receives an empty calendar and populates it with issues by reading files from cache
*/
const insertClosed = async (
  calendar: ICalendar,
  closedIssues: Array<IJiraIssue>,
) => {
  const updatedCalendar: ICalendar = JSON.parse(JSON.stringify(calendar));
  for (const issue of closedIssues) {
    if (updatedCalendar.days[issue.closedAt] !== undefined) {
      updatedCalendar.days[issue.closedAt].completion.issues.count++;
      updatedCalendar.days[issue.closedAt].completion.list.push(issue);
      if (issue.points !== undefined && issue.points !== null) {
        updatedCalendar.days[issue.closedAt].completion.points.count +=
          issue.points;
      }
      if (
        issue.fields.labels.filter(
          (label: string) => stringClean(label) === stringClean('Scope Change'),
        ).length !== 0
      ) {
        updatedCalendar.days[issue.closedAt].scopeChangeCompletion.issues
          .count++;
        updatedCalendar.days[issue.closedAt].scopeChangeCompletion.list.push(
          issue,
        );
        if (issue.points !== undefined && issue.points !== null) {
          updatedCalendar.days[
            issue.closedAt
          ].scopeChangeCompletion.points.count += issue.points;
        }
      }
    }
    // Add issue to the week object
    const closedDate = new Date(issue.closedAt);
    let closedMonthDay = closedDate.getDate();
    if (closedDate.getDay() !== 0) {
      // eslint-disable-next-line operator-assignment
      closedMonthDay = closedMonthDay - closedDate.getDay();
    }
    const closedWeek = new Date(
      closedDate.getFullYear(),
      closedDate.getMonth(),
      closedMonthDay,
    );
    const closedWeekKey = closedWeek.toJSON().slice(0, 10);
    if (updatedCalendar.weeks[closedWeekKey] !== undefined) {
      updatedCalendar.weeks[closedWeekKey].completion.issues.count++;
      updatedCalendar.weeks[closedWeekKey].completion.list.push(issue);
      if (issue.points !== undefined && issue.points !== null) {
        updatedCalendar.weeks[closedWeekKey].completion.points.count +=
          issue.points;
      }
      if (
        issue.fields.labels.filter(
          (label: string) => stringClean(label) === stringClean('Scope Change'),
        ).length !== 0
      ) {
        updatedCalendar.weeks[closedWeekKey].scopeChangeCompletion.issues
          .count++;
        updatedCalendar.weeks[closedWeekKey].scopeChangeCompletion.list.push(
          issue,
        );
        if (issue.points !== undefined && issue.points !== null) {
          updatedCalendar.weeks[
            closedWeekKey
          ].scopeChangeCompletion.points.count += issue.points;
        }
      }
    }
  }
  /*
  for (let [dateKey, dateData] of Object.entries(updatedCalendar.days)) {
    const issuesFile = path.join(cacheDir, "completed-" + dateKey + ".ndjson");
    const issues = await readIssues(issuesFile);
    //console.log("Reading issues from file: " + issuesFile + ' - Issues found: ' + issues.length)
    for (let issue of issues) {
    }
  }
  */
  return updatedCalendar;
};

export default insertClosed;
