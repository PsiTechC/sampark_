


//let videoStream = null;

myapp.IsLocal = true;
myapp.root = "";
myapp.AccessPointID = null;
myapp.currentUserRoleName = null;
myapp.clientName = null;
myapp.BoolOTPRequired = false;
myapp.ReadQRByDeviceCam = true;

myapp.Main.ImageFilePath_render = function (element, contentItem) {
    // Write code here.
    contentItem.dataBind("value", function (newVal) {
        if (newVal) {

            var xx = newVal.split("\\");
            var imgURL = myapp.root + "/" + newVal.split("\\")[xx.length - 2] + "/" + newVal.split("\\")[xx.length - 1];


            // Create a container div for the image and text
            var container = $('<div style="text-align: center; align-items: center; justify-content: center; "></div>');

            // Create the image element
            var img = $('<img src="' + imgURL + '" height="60px" width="100%">');

            // Append the image and text to the container
            container.append(img);

            // Append the container to the element
            $(element).append(container);
        }
    });
};
myapp.Main.btnCheckIn_postRender = function (element, contentItem) {
    // Write code here.
 var imgURL = myapp.root + '/assets/img/check-in-1.svg';
    

    // Hide the existing button
    //$(element).find('button').hide();
    $(element).find('a').hide();

    // Create a container div for the image and text
    var container = $('<div style="text-align: center; align-items: center; justify-content: center; "></div>');

    // Create the image element
    var img = $('<img src="' + imgURL + '" height="50px" width="50px">');

    // Create the text element
    var text = $('<div><b>Check-In</b></div>');

    // Append the image and text to the container
    container.append(img);
    container.append(text);

    // Append the container to the element
    $(element).append(container);
};
myapp.Main.btnCheckOut_postRender = function (element, contentItem) {
    // Write code here.
    var imgURL = myapp.root + '/assets/img/check-out-1.svg';

    // Hide the existing button
    //$(element).find('button').hide();
    $(element).find('a').hide();

    // Create a container div for the image and text
    var container = $('<div style="text-align: center; align-items: center; justify-content: center; "></div>');

    // Create the image element
    var img = $('<img src="' + imgURL + '" height="50px" width="50px">');

    // Create the text element
    var text = $('<div><b>Check-Out</b></div>');

    // Append the image and text to the container
    container.append(img);
    container.append(text);

    // Append the container to the element
    $(element).append(container);
};
myapp.Main.ClientList_postRender = function (element, contentItem) {
    // Write code here.
    // Apply flexbox styling to center components horizontally
    $(element).css({
        "display": "flex",            // Use flexbox
        "flex-direction": "column",   // Align items in a column
        "align-items": "center",      // Center items horizontally
        //"justify-content": "center",  // Center items vertically if needed
        "width": "100%",              // Ensure the container takes full width
        "height": "100vh",            // Optional: center items vertically by making the height of the container the full viewport height
    });
};

myapp.Main.created = function (screen) {
    // Write code here.
    if (myapp.IsLocal)
        myapp.root = location.protocol + "//" + location.host;
    else
        myapp.root = location.protocol + "//" + location.host + "/" + location.pathname.split("/")[1];

    myapp.activeDataWorkspace.ApplicationData.GETCurrentUserRole().execute().then(function (role) {
        if (role.results.length > 0) {
            myapp.currentUserRoleName = role.results[0].Name;
            if (myapp.currentUserRoleName === "Administrator") {
                //myapp.showBrowseClients();
                myapp.showAdminDashboard();
            }
                
           

        }
    });

    screen.Clients.addChangeListener("state", function () {
        if (screen.Clients.state === msls.VisualCollection.State.idle) {
            myapp.BoolOTPRequired = screen.Clients.data[0].IsOTPValidationRequired;


            if (screen.Clients.data[0].FirstTimeLogin == true) {
                setTimeout(() => {
                    console.log("Delayed for 1 second.");
                    myapp.showChangePassword(screen.Clients.data[0]);
                }, "1000");



            }
        }
    });

    

};
myapp.Main.btnCheckIn_execute = function (screen) {
    // Write code here.
    myapp.showCheckInCheckOut("Check-In", {
        beforeShown: function (addEditScreen) {

        },
        afterClosed: function (addEditScreen, navigationAction) {
            screen.Visitors.refresh();
        }
    });
};
myapp.Main.btnCheckOut_execute = function (screen) {
    // Write code here.
    myapp.showCheckInCheckOut("Check-Out", {
        beforeShown: function (addEditScreen) {

        },
        afterClosed: function (addEditScreen, navigationAction) {
            screen.Visitors.refresh();
        }
    });
};
myapp.Main.ImageFilePath1_render = function (element, contentItem) {
    // Write code here.
    contentItem.dataBind("value", function (newVal) {
        if (newVal) {

            var xx = newVal.split("\\");
            var imgURL = myapp.root + "/" + newVal.split("\\")[xx.length - 2] + "/" + newVal.split("\\")[xx.length - 1];


            // Create a container div for the image and text
            var container = $('<div style="text-align: center; align-items: center; justify-content: center; height:64px; width:64px;"></div>');

            // Create the image element
            var img = $('<img src="' + imgURL + '" alt="Visitor Image" style="border-radius:50%;  height:64px; width:64px;">');

            // Append the image and text to the container
            container.append(img);

            // Append the container to the element
            $(element).append(container);
        }
        else {
            var imgURL = myapp.root + '/assets/img/user-image.svg';

            // Create a container div for the image and text
            var container = $('<div style="text-align: center; align-items: center; justify-content: center;"></div>');

            // Create the image element with border-radius applied
            var img = $('<img src="' + imgURL + '" alt="Image" style="height: 100%; width: 100%; border-radius: 50%;" />');

            // Append the image to the container
            container.append(img);

            // Append the container to the element
            $(element).append(container);
            contentItem.screen.findContentItem("ConfirmCheckIn").isEnabled = false;
        }
    });
};
myapp.Main.PassID_postRender = function (element, contentItem) {
    // Write code here.
    $(element).css('vertical-align', 'middle');
};
myapp.Main.ComingFrom_postRender = function (element, contentItem) {
    // Write code here.
    $(element).css('vertical-align', 'middle');
};
myapp.Main.Purpose_postRender = function (element, contentItem) {
    // Write code here.
    $(element).css('vertical-align', 'middle');
};
myapp.Main.Host_postRender = function (element, contentItem) {
    // Write code here.
    $(element).css('vertical-align', 'middle');
};
myapp.Main.VisitorID_postRender = function (element, contentItem) {
    // Write code here.
    $(element).css('vertical-align', 'middle');
};
myapp.Main.CheckIn_postRender = function (element, contentItem) {
    // Write code here.
    $(element).css('vertical-align', 'middle');
};
myapp.Main.CheckOut_postRender = function (element, contentItem) {
    // Write code here.
    $(element).css('vertical-align', 'middle');
};
myapp.Main.Group2_postRender = function (element, contentItem) {
    // Write code here.
    $(element).css('vertical-align', 'middle');
};
myapp.Main.Group3_postRender = function (element, contentItem) {
    // Write code here.
    $(element).css('vertical-align', 'middle');
};
myapp.Main.Group4_postRender = function (element, contentItem) {
    // Write code here.
    $(element).css('vertical-align', 'middle');
};
myapp.Main.Print_postRender = function (element, contentItem) {
    // Write code here.
    var imgURL = myapp.root + '/assets/img/print.svg';

    // Clear the button's existing content (if any)
    $(element).empty();

    // Append an image inside the button element
    $(element).append('<img src="' + imgURL + '" alt="Print" style="width: 30px; height: 30px;" />');

    // Optional: Style the button to remove any borders or default appearance
    $(element).css({
        'border': 'none',
        'background': 'transparent',  // Remove the button background
        'padding': '5px',             // Add padding if needed
        'cursor': 'pointer'           // Change the cursor to a pointer to indicate it's clickable
    });
};
myapp.Main.WhatsApp_postRender = function (element, contentItem) {
    // Write code here.
    var imgURL = myapp.root + '/assets/img/whatsapp.svg';

    // Clear the button's existing content (if any)
    $(element).empty();

    // Append an image inside the button element
    $(element).append('<img src="' + imgURL + '" alt="Print" style="width: 30px; height: 30px;" />');

    // Optional: Style the button to remove any borders or default appearance
    $(element).css({
        'border': 'none',
        'background': 'transparent',  // Remove the button background
        'padding': '5px',             // Add padding if needed
        'cursor': 'pointer'           // Change the cursor to a pointer to indicate it's clickable
    });
};
myapp.Main.SMS_postRender = function (element, contentItem) {
    // Write code here.
    var imgURL = myapp.root + '/assets/img/sms.svg';

    // Clear the button's existing content (if any)
    $(element).empty();

    // Append an image inside the button element
    $(element).append('<img src="' + imgURL + '" alt="Print" style="width: 30px; height: 30px;" />');

    // Optional: Style the button to remove any borders or default appearance
    $(element).css({
        'border': 'none',
        'background': 'transparent',  // Remove the button background
        'padding': '5px',             // Add padding if needed
        'cursor': 'pointer'           // Change the cursor to a pointer to indicate it's clickable
    });
};
myapp.Main.ScreenContent_render = function (element, contentItem) {
    // Write code here.
    var existed = $('#rptPrintVisitor');

    if (existed.length > 0) {
        existed.remove();
    }

    var HtmlContent = $("<div id='rptPrintVisitor'></div>").html("<object width='1200px' height='0px' data='../ReportAspx/PrintVisitor.aspx' />");
    HtmlContent.appendTo($(element));
};
myapp.Main.Print_execute = function (screen) {
    // Write code here.
    var rptPrintVisitor = screen.findContentItem("ScreenContent");
    var Id = screen.Visitors.selectedItem.Id;
    $("#rptPrintVisitor").html("<object width='1200px' height='0px' data='../ReportAspx/PrintVisitor.aspx?Id=" + Id + "' />");

};
myapp.Main.WhatsApp_execute = function (screen) {

    // Retrieve the selected visitor
    var visitor = screen.Visitors.selectedItem;
    if (visitor) {
        var visitorId = visitor.Id;
        var visitorName = visitor.Name;
        var visitorMobile = visitor.Mobile;

        // Validate that the mobile number exists
        if (visitorMobile) {
            visitorMobile = "+91" + visitorMobile; // Add country code

            // Construct the absolute URL for the Visitor's Pass PDF
            var passUrl = myapp.root + "/ReportAspx/PrintVisitor.aspx?Id=" + visitorId;

            // Construct the WhatsApp message
            var message = "Hello " + visitorName + ",\nYour Visitor Pass is ready. Please click the link below to view your pass:\n" + passUrl;

            // Construct the WhatsApp Web URL
            var whatsappUrl = "https://web.whatsapp.com/send?phone=" + visitorMobile + "&text=" + encodeURIComponent(message);

            // Open WhatsApp Web to send the message (this may still open a new tab, but could reuse an existing one)
            window.open(whatsappUrl, 'visitor_pass_window');
        } else {
            // Display an error message if the mobile number is missing
            msls.showMessageBox("Mobile number is not available for this visitor.", { title: "Missing Mobile Number" });
        }
    } else {
        // Display an error message if no visitor is selected
        msls.showMessageBox("Please select a visitor to send the WhatsApp message.", { title: "No Visitor Selected" });
    }


};

myapp.Main.Dashboard_execute = function (screen) {
    // Write code here.
    if (myapp.currentUserRoleName === "Administrator")
        //console.log("admin dashboard");
        myapp.showAdminDashboard();
    else
        myapp.showHome();
};

myapp.Main.columns_postRender = function (element, contentItem) {
    // Write code here.
    $(element).parent().css('border', 'none');
    $(element).parent().css('padding', '0px');
};







myapp.Main.WhatsApp_execute = async function (screen) {
    const visitor = screen.Visitors.selectedItem;
    if (!visitor) {
        msls.showMessageBox("Please select a visitor to send the WhatsApp message.", { title: "No Visitor Selected" });
        return;
    }

    const visitorId = visitor.Id;
    const visitorName = visitor.Name;
    let visitorMobile = visitor.Mobile;

    if (!visitorMobile) {
        msls.showMessageBox("Mobile number is not available for this visitor.", { title: "Missing Mobile Number" });
        return;
    }

    // Ensure the number starts with country code
    visitorMobile = "+91" + visitorMobile;

    const passUrl = myapp.root + "/ReportAspx/PrintVisitor.aspx?Id=" + visitorId;

    const apiUrl = 'https://whatsapp-api-backend-production.up.railway.app/api/send-message';

    const requestBody = {
        to_number: visitorMobile,
        media_url: passUrl,
        media_name: `${visitorName}'s Visitor Pass`,
        parameters: [visitorName],
        messages: null,
        template_name: "atithi_v1",
        whatsapp_request_type: "TEMPLATE_WITH_DOCUMENT"
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'ef99d3d2-e032-4c04-8e27-9313b2e6b172', 
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(`✅ WhatsApp document message sent successfully to ${visitorMobile}:`, result);

        msls.showMessageBox("WhatsApp message sent successfully.", { title: "Success" });

    } catch (error) {
        console.error('❌ Error sending WhatsApp message:', error);
        msls.showMessageBox("Failed to send WhatsApp message. Please try again later.", { title: "Error" });
    }
};
