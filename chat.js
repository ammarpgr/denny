document.addEventListener('DOMContentLoaded', () => {


  if(!localStorage.getItem('opt_list'))
    (localStorage.setItem('opt_list', 'default'))

  if (!localStorage.getItem('ary_message'))
      (localStorage.setItem('ary_message', 'default'))

  var opt_msg = [];
  var opt_r = [];
  var ary =[];
  var temp = "";

  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    if (localStorage.getItem('opt_list') != 'default'){
      opt_r = JSON.parse(localStorage.getItem('opt_list'));

      option_creator(opt_r, '.list', 'option');
      console.log('if unnder' + opt_r);
    };

    if (localStorage.getItem('ary_message') != 'default'){
      ary = JSON.parse(localStorage.getItem('ary_message'));
      console.log(ary);

      option_creatori(ary, '#messages', 'li');
    };


  socket.on('connect', () => {
    document.querySelector('.message').onsubmit = () =>{
      const message = document.querySelector('#input_msg').value;
      const room = document.querySelector('#room').value;

      document.querySelector('#room').value = "";
      document.querySelector('#input_msg').value = "";

      // room exitance check
      var gotcha = checker(opt_r,room);
      console.log(gotcha);

      // pass if not exited otherwise rase error
      if (gotcha != ':P'){
          socket.emit('n_message', {'message': message, 'room': room})
      }
      return  false;
    };
  });

  socket.on('confirmed', user_message => {
    // displaying initial messages
    const li = document.createElement('li');
    li.innerHTML = user_message.message;
    //console.log(li.innerHTML);
    document.querySelector('#messages').append(li);
    //console.log("2:" + list);

    // checking & creating options
    var opt_check = checker(opt_r, user_message.room);

    if (opt_check != ':P'){
      const option = document.createElement('option');
      option.innerHTML = user_message.room;
      document.querySelector('.list').append(option);

      // remebering localstorage channel created
      console.log(user_message.room)
      opt_r.push(user_message.room);
      localStorage.setItem('opt_list', JSON.stringify(opt_r))
      console.log(opt_r)
    }


    // remembering the message list
    console.log("message: "+ opt_msg);
    opt_msg.push(user_message.message);

    // new feature // temp is doing nothing, right now!
    if (temp != user_message.room) { // if the room is not already created
      ary.push({[user_message.room]: opt_msg}); //
      console.log(ary);
      console.log("temp: " +temp);
      localStorage.setItem('ary_message', JSON.stringify(ary));
    }
    else { // if the room created go to that room updated the list
      ary[0][user_message.room] = opt_msg
    }


    temp = user_message.room;



    //
    localStorage.setItem('opt_message',JSON.stringify(opt_msg));
    console.log("message: "+ opt_msg);




  });

  socket.on('connect', () => {
    document.querySelector('#list_btn').onclick = () => {
      var sel = document.querySelector('.list')
      var opt = sel.options[sel.selectedIndex].value;
      var msg_list = document.querySelector('#msg_list').value;

      document.querySelector('#msg_list').value="";
      socket.emit('n_message', {'message': msg_list, 'room' : opt});
    };
  })

function option_creator (opt_name, aug, type){
  console.log("funL: "+ opt_name);
  console.log(aug);
  for (i in opt_name){
    const option = document.createElement(type);
    option.innerHTML = opt_name[i];
    console.log("func insude: "+ opt_name[i]);
    document.querySelector(aug).append(option);
  };
};


function checker (room_list, room){
  for (i in room_list) {
    if (room_list[i] == room){
      //alert('channel Already Exit');
      return ':P';
    };
  };
};

function option_creatori (opt_name, aug, type){

  for (i in opt_name){
    for (j in opt_name[i]){
      for (k in opt_name[i][j]){
        console.log("fucnt: "+opt_name[i][j][k]);
        const option = document.createElement(type);
        option.innerHTML = opt_name[i][j][k];
        console.log("func insude: "+ opt_name[i][j][k]);
        document.querySelector(aug).append(option);
      };

    };

  };
};
// testing the fucntions
//var room_name = '2';
//console.log(magic(room_name, ary));
//console.log(ary.length);
//console.log("i: " +chicky);


  function magic (room_name, core_list){
    const check = core_list.length;
    for (i in check){
      if (Object.keys(core_list[i]) == room_name){
          console.log(":D");
      }
      else{
          console.log(";)");
      }

    };
  };



});
