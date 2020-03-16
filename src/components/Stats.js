import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Moment from 'react-moment';
import 'moment-timezone';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    textAlign: 'center'
  },
  text: {
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(12),
    paddingBottom: theme.spacing(0),
    elevation: 0,
    spacing: 4,
    alignContent: 'stretch',
    textAlign: 'left',
    p: { color: theme.palette.text.secondary }
  },
  number: {
    color: 'red'
  },
  button: {
    padding: theme.spacing(2),
    elevation: 0
  },
  pie: {
    padding: theme.spacing(0),
    elevation: 0,
    spacing: 4,
    alignContent: 'center',
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
}));

export default function Stats() {
  const [confirmed, setConfirmed] = useState([]);
  const [deaths, setDeaths] = useState([]);
  const [recovered, setRecovered] = useState([]);
  const classes = useStyles();

  useEffect(() => fetchConfirmed(), []);
  useEffect(() => fetchDeaths(), []);
  useEffect(() => fetchRecovered(), []);

  const fetchConfirmed = () => {
    fetch(
      'https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData'
    )
      .then(response => response.json())
      .then(data => setConfirmed(data.confirmed));
  };

  const fetchDeaths = () => {
    fetch(
      'https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData'
    )
      .then(response => response.json())
      .then(data => setDeaths(data.deaths));
  };

  const fetchRecovered = () => {
    fetch(
      'https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData'
    )
      .then(response => response.json())
      .then(data => setRecovered(data.recovered));
  };

  const result = _(confirmed)
    .groupBy(x => x.healthCareDistrict)
    .map((value, key) => ({
      healthCareDistrict: key,
      totalamount: _.size(value, 'id')
    }))
    .value();

  const data = result.map(data => ({
    name: data.healthCareDistrict,
    value: data.totalamount
  }));

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#ff99ff',
    '#ffff66',
    '#b3e6b3',
    '#e6194b',
    '#3cb44b',
    '#ffe119',
    '#4363d8',
    '#f58231',
    '#911eb4',
    '#46f0f0',
    '#f032e6',
    '#bcf60c',
    '#fabebe',
    '#008080',
    '#e6beff',
    '#9a6324',
    '#fffac8',
    '#800000',
    '#aaffc3',
    '#808000',
    '#ffd8b1',
    '#000075',
    '#808080',
    '#ffffff',
    '#000000'
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      ></text>
    );
  };

  const columns = [
    {
      Header: 'Date & Time',
      accessor: 'date',
      defaultSortDesc: 'true',

      Cell: date => (
        <div>
          <Moment format="DD/MM/YYYY  HH:mm">{date.value}</Moment>
        </div>
      )
    },
    {
      Header: 'Health Care District',
      accessor: 'healthCareDistrict'
    },
    {
      Header: 'Infection Source',
      accessor: 'infectionSourceCountry'
    }
  ];

  return (
    <div className={classes.root}>
      <h1>Coronavirus disease (COVID-19) outbreak in Finland</h1>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <div className={classes.pie}>
            <PieChart alignItems="center" width={400} height={400}>
              <Tooltip />
              <Pie
                data={data}
                cx={200}
                cy={200}
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </div>
        </Grid>
        <Grid item xs={12} sm={8}>
          <div className={classes.text}>
            <h2>Corona updates</h2>

            <p>You can sort the table below by clicking the header</p>
            <p>
              Total amounts per health district can be seen by hovering over the
              pie chart
            </p>
            <Divider />
            <p>Total confirmed cases in Finland: </p>
            <h4 className={classes.number}>{_.size(confirmed)}</h4>

            <p>Total confirmed deaths in Finland: </p>
            <h4 className={classes.number}>{_.size(deaths)}</h4>

            <p>Total confirmed recovered cases in Finland: </p>
            <h4 className={classes.number}>{_.size(recovered)}</h4>
            <Divider />
            <div className={classes.button}>
              <Button variant="outlined" color="secondary" href="index.html">
                Go Back Home
              </Button>
            </div>
            <Divider />
            <p>
              This data is provided by:{' '}
              <a
                href="https://github.com/HS-Datadesk/koronavirus-avoindata"
                target="blank"
              >
                Helsingin Sanomat
              </a>{' '}
            </p>
          </div>
        </Grid>
        <Grid item xs={12}>
          <ReactTable filterable={false} data={confirmed} columns={columns} />
          <Divider />
        </Grid>
      </Grid>
    </div>
  );
}
