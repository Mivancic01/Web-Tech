onmessage = e => {
//  const method = e.data[0];
  const noteText = e.data;
  console.log(`[From Main]: ${noteText}`);
  var res = "";
  //String to base64
  res = btoa(noteText);
  const reply = postMessage(res);
};