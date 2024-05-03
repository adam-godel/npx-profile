#!/usr/bin/env node
'use strict'

import chalk from 'chalk'
import boxen from 'boxen'
import clear from 'clear'
import inquirer from 'inquirer'
import Enquirer from 'enquirer'
import open from 'open'
import QuantumCircuit from 'quantum-circuit'
import terminalLink from 'terminal-link'
import terminalImage from 'terminal-image'
import playSound from 'play-sound'
import cliProgress from 'cli-progress'

import { fileURLToPath } from 'url'
import { dirname } from 'path'
import * as path from 'path'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const data = {
    name: chalk.bold.green('Adam Godel'),
    website: chalk.green(terminalLink('adam-godel.github.io', 'https://adam-godel.github.io')),
    labelWebsite: chalk.white('Website:'),
    github: chalk.green(terminalLink('@adam-godel', 'https://github.com/adam-godel')),
    labelGithub: chalk.white('GitHub:'),
    email: chalk.green(terminalLink('agodel@bu.edu', 'mailto:agodel@bu.edu')),
    labelEmail: chalk.white('Email:')
}

const card = boxen(
    [
        `${data.name}`,
        ``,
        `${data.labelWebsite} ${data.website}`,
        `${data.labelGithub} ${data.github}`,
        `${data.labelEmail} ${data.email}`
    ].join('\n'),
    {
        margin: 1,
        padding: 1,
        borderStyle: 'double',
        borderColor: 'green'
    }
);

const questions = [
    {
        type: "list",
        name: "action",
        message: "Select an action",
        choices: [
            {
                name: `About Me`,
                value: () => {
                    console.log("My name is Adam Godel and I am a first-year student studying\nmathematics and computer science at Boston University. While\nI am interested in a multitude of CS topics, my recent research\ninterest has been quantum computing. Feel free to contact me or\nlook at my projects on GitHub!\n");
                }
            },
            {
                name: `Contact Me`,
                value: () => {
                    open("mailto:agodel@bu.edu");
                    console.log("Looking forward to responding to your message!\n");
                }
            },
            {
                name: `Flip an Entangled Coin`,
                value: async () => {
                    console.log("The entangled coin is made up of two qubits that always share the same state.");
                    await new Promise(resolve => setTimeout(resolve, 2500));
                    console.log("Preparing to generate quantum circuit...");
                    const bar = new cliProgress.Bar({
                        format: ' >> [\u001b[37m{bar}\u001b[0m] {percentage}%',
                        barCompleteChar: '\u2588',
                        barIncompleteChar: '\u2591',
                        barGlue: '\u001b[90m'
                    });
                    bar.start(120, 0);
                    for (let i = 0; i < 6; i++) {
                        await new Promise(resolve => setTimeout(resolve, Math.floor((Math.random() * 500) + 500)));
                        bar.increment(Math.floor((Math.random() * 4) + 20));
                    }
                    process.stdout.write("\n");

                    // image and sound, all for show of course :)
                    console.log(await terminalImage.file(path.resolve(__dirname, './assets/AntManQuantumania.gif'), {height: '60%'}));
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    const player = playSound();
                    player.play(path.resolve(__dirname, './assets/AntManQuantumania.mp3'), function (err) {
                        if (err) throw err;
                    });
                    console.log("Generating quantum circuit...");
                    bar.start(14000, 0);
                    const times = [221, 273, 561, 701, 744, 763, 899, 665, 741, 977, 996, 854, 752, 827, 753, 782, 822, 819, 797, 53];
                    for (let i = 0; i < times.length; i++) {
                        await new Promise(resolve => setTimeout(resolve, times[i]));
                        bar.increment(times[i+1 < times.length ? i+1 : 0]);
                    }
                    process.stdout.write("\n");
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    // actual initialization of the quantum circuit
                    clear();
                    console.log(card);
                    var circuit = new QuantumCircuit(2);
                    circuit.appendGate("h", 0);
                    circuit.appendGate("cx", [0, 1]);
                    circuit.run();
                    console.log("Quantum circuit ready!");
                    circuit.print();

                    const response = await prompt({
                        type: 'input',
                        name: 'count',
                        message: 'How many times would you like to flip the coin? (Max 1000)'
                    });
                    for (let i = 1; i <= (response.count > 1000 ? 1000 : response.count); i++) {
                        circuit.run();
                        console.log("Flip #"+i+": "+circuit.measure(0)+""+circuit.measure(1));
                    }
                }
            },
            {
                name: `Read/Write Values in QRAM`,
                value: async () => {
                    console.log("Quantum Random Access Memory allows you to use a quantum circuit\nto read and write bit information. This quantum circuit has four\nmemory locations, from 00 to 11, encoded using 10 qubits in total.");
                    var circuit = new QuantumCircuit(10);
                    circuit.appendGate("ccx", [9, 3, 7]);
                    circuit.appendGate("ccx", [9, 2, 6]);
                    circuit.appendGate("ccx", [9, 1, 5]);
                    circuit.appendGate("ccx", [9, 0, 4]);
                    circuit.appendGate("ccx", [3, 7, 8]);
                    circuit.appendGate("ccx", [2, 6, 8]);
                    circuit.appendGate("ccx", [1, 5, 8]);
                    circuit.appendGate("ccx", [0, 4, 8]);

                    let cont = true;
                    while (cont) {
                        const select = await Enquirer.prompt([{
                            type: "toggle",
                            name: "write",
                            message: "Select an action",
                            enabled: 'Write',
                            disabled: 'Read',
                            default: false
                        }]);
                        const response = await prompt({
                            type: 'list',
                            name: 'address',
                            message: 'Select an address to ' + (select.write ? 'write to' : 'read from'),
                            choices: ['00', '01', '10', '11']
                        });
                        circuit.run([
                            response.address == '00',
                            response.address == '01',
                            response.address == '10',
                            response.address == '11',
                            circuit.measure(4),
                            circuit.measure(5),
                            circuit.measure(6),
                            circuit.measure(7),
                            false,
                            select.write
                        ]);
                        
                        if (select.write)
                            console.log("Applied X gate at address " + response.address + "!");
                        else
                            console.log("Address " + response.address + ": " + circuit.measure(8));
                        await Enquirer.prompt([{
                            type: "toggle",
                            name: "exit",
                            message: "Continue?",
                            enabled: 'No',
                            disabled: 'Yes',
                            default: false
                        }]).then(answer => {
                            if (answer.exit)
                                cont = false;
                        });
                    }
                }
            },
            {
                name: `Exit`,
                value: () => {
                    console.log("Have a nice day!\n");
                    process.exit();
                }
            }
        ]
    }
];
const prompt = inquirer.createPromptModule();

const followup = [
    {
        type: "toggle",
        name: "exit",
        message: "Exit?",
        enabled: 'Yes',
        disabled: 'No',
        default: false
    }
];

async function init() {
    clear();
    console.log(card);
    await prompt(questions).then(answer => answer.action());
    await Enquirer.prompt(followup).then(answer => {
        if (!answer.exit) {
            init();
        } else {
            console.log("Have a nice day!\n");
            process.exit();
        }
    });
}

process.removeAllListeners('warning'); // suppress antlr4 warning
init();