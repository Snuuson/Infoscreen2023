import isPi from 'detect-rpi';
import rpio from 'rpio';
import config from 'config';

class RPiGPIO {
    inputPin;
    outputPin1;
    outputPin2;
    onChange: CallableFunction;
    currentValue: boolean;
    constructor(onChange: CallableFunction) {
        this.onChange = onChange;
        this.currentValue = false;
        if (isPi()) {
            this.setup();
        }
    }
    setup = () => {
        const GPIOconfig = <any>config.get('GPIO');
        this.inputPin = GPIOconfig.input_1;
        console.log(`inputPin:  ${this.inputPin}`);
        this.outputPin1 = GPIOconfig.output_1;
        console.log(`outputPin1:  ${this.outputPin1}`);
        this.outputPin2 = GPIOconfig.output_2;
        console.log(`outputPin2:  ${this.outputPin2}`);

        rpio.open(this.inputPin, rpio.INPUT, rpio.PULL_UP);
        console.log(`${this.inputPin}: setup as INPUT and PULL_UP`);
        rpio.open(this.outputPin1, rpio.OUTPUT, rpio.LOW);
        console.log(`${this.outputPin1}: setup as OUTPUT `);
        rpio.open(this.outputPin2, rpio.OUTPUT, rpio.LOW);
        console.log(`${this.outputPin2}: setup as OUTPUT `);

        rpio.poll(this.inputPin, (pin: number) => {
            rpio.msleep(10);
            //Since its a pullUp pin we invert the result to get True for "Can Enter" and False for "Please Wait"
            let value = rpio.read(pin) ? false : true;
            console.log('Polling:');
            if (this.currentValue != value) {
                if (value) {
                    //Can Enter
                    rpio.write(this.outputPin1, rpio.HIGH);
                    rpio.write(this.outputPin2, rpio.LOW);
                } else {
                    //Please Wait
                    rpio.write(this.outputPin1, rpio.LOW);
                    rpio.write(this.outputPin2, rpio.HIGH);
                }
                console.log(`outputPin1: ${rpio.read(this.outputPin1) ? true : false}`);
                console.log(`outputPin2: ${rpio.read(this.outputPin2) ? true : false}`);
                console.log(`${value}`);
                this.currentValue = value;
                this.onChange(this.currentValue);
            }
        });
    };
}

export default RPiGPIO