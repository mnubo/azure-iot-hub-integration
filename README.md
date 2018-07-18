# function-mnubo-js
Azure Iot Hub integration using Azure Function Applications and SmartObjects client.

Requirements
------------
- Docker _(packaging only)_
- [NodeJS ==6.11.2](https://nodejs.org/en/blog/release/v6.11.2/).
- A [mnubo account](https://smartobjects.mnubo.com/login) for a sandbox and/or a production with API credentials.
- [mnubo SmartObjects client](https://github.com/mnubo/smartobjects-js-client).

Pre-requisites
--------------
- Azure functions are locked to [Node JS 6.11.2](https://nodejs.org/en/blog/release/v6.11.2/) by the runtime. Make sure you have your IDE and Node JS version to support that.
- Set up an Azure IoT Hub and Function Application. If you're starting, please see the [tutorial](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-create-through-portal) for a basic set up. From there you will:
    - Create a [Service Bus namespace](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-create-namespace-portal).
    - Create a [Service Bus Queue](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-dotnet-get-started-with-queues#2-create-a-queue-using-the-azure-portal) (only step #2 is needed).
    - Set up an IoT Hub [endpoint](https://docs.microsoft.com/en-ca/azure/iot-hub/tutorial-routing#routing-to-a-storage-account) + [route](https://docs.microsoft.com/en-ca/azure/iot-hub/tutorial-routing#routing-to-a-service-bus-queue)* to point to your Service Bus Queue.

        \* For the route, put nothing in the `Query string` box if you want every messages to be sent to the function.

    - Create a Javascript Azure function that triggers on messages added. Follow step #2 of this [tutorial](https://github.com/Azure-Samples/functions-js-iot-hub-processing#step-2-azure-functions-triggered-by-iot-hub) to do so.
- You've registered on the mnubo SmartObject platform and got your sandbox credentials.
- On the mnubo SmartObject platform you've created an "Object" and an "Event" model in the SmartObjects platform [`IoT data modeler`](https://smartobjects.mnubo.com/apps/doc/datamodel.html).
   - For this function to work as is, the object type `thing` must be created and have the proper properties defined in it (the ones in the `objectCustomAttributesList` variable described in the **Development** section).
   - For this function to work as is, the event type `thing_event` must be created and have your custom attributes defined in it.

Development
-----------
- Install the required dependencies
```
npm install
```
- Make your change.
    - Modify the `clientId` constant with your mnubo SmartObject platform client ID.
    - Modify the `clientSecret` constant with your mnubo SmartObject platform client secret.
    - Make sure the `mnuboEnvironment` constant is set to the right environment.
    - The `mapIotObjectToMnuboObject` function will make information from the IoT Hub message to the mnubo SmartObject platform object definition.
        - Unless modified, this function will create a single SmartObject owner with the Device Manager name.
        - The `deviceId` field of the IoT Hub event attributes will be used as the mnubo SmartObject platform device ID.
        - The SmartObject platform object creation timestamp and last update timestamp will be set to the timestamp when we process the first message.
        - Any fields in the `objectBlacklistedAttributes` list will be filtered out.
        - Only attributes in the `objectCustomAttributesList` constant will be sent to the mnubo SmartObjects platform.
        - The `objectCustomAttributeMapping` constant allows any attribute coming from the IoT Hub to be mapped to another in the resulting mnubo SmartObject platform object.
    - The `mapIotEventToMnuboEvent` function will take a JSON object as input and will transform it to a mnubo SmartObject platform formatted event.
        - If there is a `eventType` attribute, it will set it as the event type in the event sent. Else it will use the `defaultEventType` constant as default.
        - If there is a `eventId` attribute, it will set it as the event ID in the event sent.
        - if there is a `timestamp` attribute, it will set the proper timestamp fields for the event.
        - if there is a `latitude` attribute, it will set the mnubo system fields for latitude.
        - if there is a `longitude` attribute, it will set the mnubo system fields for longitude.
        - Any fields in the `eventBlacklistedAttributes` list will be filtered out.
        - Every other attribute in the JSON object will be sent as is in the event.
        - The `eventCustomAttributeMapping` is a map to allow the renaming of any attribute in the incoming JSON object.
- Ensure syntax is right.
```
npm run lint
```
- Ensure tests pass.
```
npm run test
```

Packaging
---------
Please run:
```
./build.sh
```
This will generate a `az_mnubo_function.zip` file that you will need to deploy on Azure.

Deployment
----------

- When ready, deploy using the following steps.
    - In the Azure Functions portal, click **Platform features**
    - In the **DEVELOPMENT TOOLS** section, click **Advanced tools (Kudu)**
    - Click **Debug Console** > **CMD**.
    - Navigate to `site/wwwroot/<your_function_name>/`
    - Drag and drop the `az_mnubo_function.zip` file generated by the packaging in the fucntion folder **in the box that will appear on the right** to unzip it in the function folder.
        - It may take some time to Azure to unzip the archive (around or over 5min)
        - Even after it seems that it has done to unzip the archive, it may takes even more time for Azure to really create all the files and directories in the function directory.
        - When the new `index.js` file of the function is visible in the portal, that means that its done.

Helpful documentation
---------------------
- mnubo SmartObjects platform documentation (_**mnubo signup required**_): https://smartobjects.mnubo.com/apps/doc/gettingstarted.html
