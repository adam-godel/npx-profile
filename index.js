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

import fs from 'fs'
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
)

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
                    process.stdout.write("Preparing to generate quantum circuit");
                    for (let i = 0; i < 3; i++) {
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        process.stdout.write(".");
                    }
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    process.stdout.write("\n");

                    // image and sound, all for show of course :)
                    console.log(await terminalImage.file(path.resolve(__dirname, './assets/matrix_rain.gif')));
                    const player = playSound();
                    player.play(path.resolve(__dirname, './assets/matrix_sound.wav'), { timeout: 9500 }, function (err) {
                        if (err) throw err;
                    });
                    await new Promise(resolve => setTimeout(resolve, 9500));
                    clear();
                    console.log(card);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // actual initialization of the quantum circuit
                    var circuit = new QuantumCircuit(2);
                    circuit.addGate("h", 0, 0);
                    circuit.addGate("cx", 1, [0, 1]);
                    console.log("Quantum circuit ready!");
                    circuit.run();
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
        default: false
    }
]

async function init() {
    clear();
    console.log(card);
    await prompt(questions).then(answer => answer.action());
    await Enquirer.prompt(followup).then(answer => {
        if (!answer.exit)
            init();
        else
            console.log("Have a nice day!\n");
    });
}

process.removeAllListeners('warning'); // suppress antlr4 warning
init();