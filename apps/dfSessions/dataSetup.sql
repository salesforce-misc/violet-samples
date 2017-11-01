CREATE TABLE Sessions
(
  Level char(128),
  Industry char(128),
  Session_Theme char(128),
  Role char(128),
  Products char(128),
  Room char(128),
  Venue_Name char(128),
  Session_Date char(128),
  Session_Time char(128),
  Session_Start_Time timestamp without time zone,
  Attendance_Category char(128),
  Session_Duration integer,
  Enrollment_Count integer,
  Session_Format char(128),
  Session_Name char(128),
  Session_Abstract char(2048)
);
