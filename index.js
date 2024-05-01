#!/usr/bin/env node
'use strict'

import chalk from 'chalk'
import boxen from 'boxen'
import clear from 'clear'
import inquirer from 'inquirer'
import Enquirer from 'enquirer'
import open from 'open'
import terminalImage from 'terminal-image';

const data = {
    name: chalk.bold.green('Adam Godel'),
    website: chalk.green('adam-godel.github.io'),
    labelWebsite: chalk.white('Website:'),
    github: chalk.green('github.com/adam-godel'),
    labelGithub: chalk.white('GitHub:'),
    email: chalk.green('agodel@bu.edu'),
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
        if (!answer.exit) init();
    });
}

init();