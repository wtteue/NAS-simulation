/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    
    messageToWrite: [],
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
       app.clear();
       nfc.addTagDiscoveredListener(
            app.onNfc,
            function(status){
                
                app.display("Tag an NFC tag to register(first time) or authenticate."); 
            },
            function(error){
                app.display("NFC tag fail to initialize" + JSON.stringify(error));
            }
        );
       nfc.addNdefListener(
            app.onNfc,
            function(status){
                
                app.display("NFC on.");
            },
            function(error){
                app.display("NFC reader fail to initialize" + JSON.stringify(error));
            }
        );


    },
    onNfc: function(nfcEvent){
         
         
         app.showTag(nfcEvent.tag);

    },
    showTag:function(tag){
        var ss= new cordova.plugins.SecureStorage(
             function(){app.display("NAS initializing!");},
             function(error){app.display("Error"+ error);},
             'ProcessSimulator');
        var thisMessage=tag.ndefMessage;
        var enm=nfc.bytesToHexString(tag.id);
            if(thisMessage.length==1){
            app.showMessage(thisMessage,enm,ss);
         }  else {
            app.checking(thisMessage,enm,ss);
         }
        
    },
    showMessage:function(message,enm,ss){

        for (var thisRecord in message){
        
            var record=message[thisRecord];
            var enn=nfc.bytesToString(record.payload);
            app.showRecord(record,enm,enn,ss);
         }  
        
        
        
        
    },
    showRecord:function(record,enm,enn,ss){
        
        
        if(nfc.bytesToString(record.type)=="U"){
            
            app.makeMessage(enn);
            app.encrypt(enn,enm,ss);
            var ndefMessage=ndef.decodeMessage(record.payload);
            app.showMessage(ndefMessage);
        } 
            
            
        // var encryptmec=record.payload;
         
     
         
    // ***************************************************
    // Here we have the sealed blob of the data
    // as a string in 'sealedData' variable
    // We can store the sealed data locall
    // or in the cloud and the data will remain protected.
    // ****************************************
    //doSomethingWithSealedData(sealedData)
     //   .catch(function (error) {console.log("Fail, error code is: " + error.code + ", error message is: " + error.message);});

        
        
    },

    encrypt:function(enn,enm,ss){
        
        // function(){
        //     intel.security.secureData.createFromData( function(instanceID){
        //         intel.security.secureStorage.write(function(){
        //             var newenn={'instanceID':instanceID, 'EncryptedData':enn};
        //         });
        //     });
        // },
       
           
           ss.set(
            function(key){app.display("Set"+ key);},
            function(error){app.display("Error"+error)},
            enm, enn);
           
            
            
                
            
        
         
        

    },
    checking:function(message,enm,ss)
    {     
          app.clear();
          app.display("checking!");
          ss.get(
            function (value) { app.display('Success, got ' + value); },
            function (error) { app.display('Error ' + error); },
             enm);
    },
    display:function(message){
        var label = document.createTextNode(message),
        lineBreak = document.createElement("br");
        messageDiv.appendChild(lineBreak);
        messageDiv.appendChild(label);
    },
    clear: function(){
        messageDiv.innerHTML="";
    },
    makeMessage: function(enn){
        
        var tnf=ndef.TNF_WELL_KNOWN;
        recordType=ndef.RTD_URI;
        //var temprec=nfc.bytesToString(record.payload);
       // app.display(temprec);
       // payload=nfc.stringToBytes(sealedData);
       payload=nfc.stringToBytes(enn);
       
        payload.unshift(0x02);
        record=ndef.record(tnf,recordType, [], payload);
        message=[];
        message.push(record);
        
        payload=nfc.stringToBytes("Registered: 20160416");
        recordType=ndef.RTD_TEXT;
        record=ndef.record(tnf,recordType, [], payload);
        message.push(record);
        app.messageToWrite=message;
        app.writeTag(app.messageToWrite);
    },
    writeTag:function(message){
        nfc.write(
            message,
            function(){
                app.display("Adding secure parameters. \n");
                app.display("Wrote data to tag.");
            },
            function(reason){
                alert("There was a problem" + reason);
            }
            );
    }   
};

app.initialize();