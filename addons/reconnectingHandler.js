var tries = 0;
module.exports = client =>{
  if(tries === 0){
    console.log('DiscordJS','Trying to reconnect, maybe old instanse is still ghosting?');
    tries++;
  }else{
    console.log('DiscordJS','Trying to reconnect.... ' + tries++);
  }
};
