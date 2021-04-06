#!/usr/bin/env node

const { writeFile } = require('fs/promises');
const { get, getAsArray } = require('@parameter1/base-cms-object-path');
const { join } = require('path');
const { parse } = require('json2csv');
const moment = require('moment');
const inquirer = require('inquirer');
const client = require('./graphql/create-client');
const query = require('./graphql/queries/viewer');

const { log } = console;

const zoneIds = {
  uk: '862ba4e41caec006a5eeb37c1d6ffffd',
  pw: '33c9a8b1bc4103b8d42df58a0570222c',
  aw: '4b8d7faabfe96a2d70ffdb4caa389638',
  hcp: '92377c4f2d8d5bbe586846fde0de003f',
  oem: 'a6c44b7986703d1bad11bbb7b780da42',
  pfw: '9f7aae751375ec7deb40b4f4e0779d25',
};

const prev = moment().subtract(1, 'months');

const main = async () => {
  const { start, end, zoneId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'start',
      message: 'Start date of range to query',
      default: () => prev.startOf('month').format(),
    },
    {
      type: 'input',
      name: 'end',
      message: 'End date of range to query',
      default: () => prev.endOf('month').format(),
    },
    {
      type: 'input',
      name: 'zoneId',
      default: zoneIds.uk,
      message: 'The id of your Cloudflare zone',
    },
  ]);
  const variables = {
    zoneId,
    start: moment(start).format('YYYY-MM-DD'),
    end: moment(end).format('YYYY-MM-DD'),
  };
  const data = await client.request(query, variables);
  const set = getAsArray(data, 'viewer.zones.0.httpRequests1dGroups');
  const fields = ['Date', 'Successful', 'Client Error', 'Server Error', '', '200', '206', '301', '302', '304', '400', '403', '404', '405', '412', '499', '521', '522', '526'];

  const objs = set.map((day) => {
    const date = get(day, 'dimensions.date');
    const values = getAsArray(day, 'sum.responseStatusMap');
    return {
      date,
      ...values.reduce((obj, v) => {
        const code = `${v.edgeResponseStatus}`;
        if (!fields.includes(code)) fields.push(code);
        return { ...obj, [code]: v.requests };
      }, {}),
    };
  });

  try {
    const out = parse(objs, { fields });
    await writeFile(join(process.cwd(), 'out.csv'), out);
  } catch (err) {
    log('Error encountered!', err);
  }
};

process.on('unhandledRejection', (e) => { throw e; });
main().then(() => log('Data written to `out.csv`')).catch((e) => setImmediate(() => { throw e; }));
