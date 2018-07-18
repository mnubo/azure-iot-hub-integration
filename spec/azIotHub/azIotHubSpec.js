describe('azIotHub', function() {
    const azIotHub = require('../../index');
    const debugMessage = {
        'deviceId': 'my-super-awesome-device',
        'my_custom_object_attribute': 'some_value',
        'temperature': '26.078376941669557',
        'humidity': '62.91980522282583',
        'my_custom_event_attribute': 'some_value'
    };

    it('should map a debug message to an object', function() {
        const defaultOwner = 'owner-1';
        const defaultObjectType = 'thing';
        const blacklist = [];
        const customAttributes = ['my_custom_attribute'];
        const customAttributeMapping = {};
        const mnuboObject = azIotHub.mapIotObjectToMnuboObject(
            debugMessage,
            defaultOwner,
            defaultObjectType,
            blacklist,
            customAttributes,
            customAttributeMapping
        );

        expect(mnuboObject.x_device_id).toEqual(debugMessage.deviceId);

        expect(mnuboObject.x_object_type).toEqual(defaultObjectType);
        expect(mnuboObject.x_owner.username).toEqual(defaultOwner);
        expect(mnuboObject.my_custom_attribute)
            .toEqual(debugMessage.my_custom_attribute);
    });

    it('should map a debug message to an event', function() {
        const defaultEventType = 'thing_event';
        const deviceId = debugMessage.deviceId;
        const blacklist = [];
        const customAttributeMapping = {};
        const mnuboEvent = azIotHub.mapIotEventToMnuboEvent(
            debugMessage,
            defaultEventType,
            deviceId,
            blacklist,
            customAttributeMapping
        );

        expect(mnuboEvent.x_object.x_device_id).toEqual(debugMessage.deviceId);

        expect(mnuboEvent.x_event_type).toEqual(defaultEventType);
        expect(mnuboEvent.temperature).toEqual(debugMessage.temperature);
        expect(mnuboEvent.humidity).toEqual(debugMessage.humidity);
        expect(mnuboEvent.my_custom_event_attribute)
            .toEqual(debugMessage.my_custom_event_attribute);
    });
});
