function ChatScheduleForm(
  id,
  botInfo,
  scheduletitle,
  CalendarContent,
  CalendarLocation,
  Startvalue,
  endvalue,
  empName,
  position
) {
  const chatSchedule = {
    chatroomId: id,
    writer: botInfo,
    chatContent:
      '{' +
      '"' +
      'scheduletitle' +
      '"' +
      ':' +
      '"' +
      scheduletitle +
      '"' +
      ',' +
      '"' +
      'CalendarContent' +
      '"' +
      ':' +
      '"' +
      CalendarContent +
      '"' +
      ',' +
      '"' +
      'CalendarLocation' +
      '"' +
      ':' +
      '"' +
      CalendarLocation +
      '"' +
      ',' +
      '"' +
      'Startvalue' +
      '"' +
      ':' +
      '"' +
      Startvalue +
      '"' +
      ',' +
      '"' +
      'endvalue' +
      '"' +
      ':' +
      '"' +
      endvalue +
      '"' +
      ',' +
      '"' +
      'empName' +
      '"' +
      ':' +
      '"' +
      empName +
      '"' +
      ',' +
      '"' +
      'position' +
      '"' +
      ':' +
      '"' +
      position +
      '"' +
      '}',
    status: 2,
  };
  return chatSchedule;
}
export default ChatScheduleForm;
