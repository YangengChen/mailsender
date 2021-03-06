import React, { Fragment, useEffect, useState } from 'react';
import { 
  makeStyles,
  Grid,
  Typography,
  Paper,
  Divider,
  Box,
  Button,
  Tooltip
} from '@material-ui/core';
import { apiRequest } from '../../utils';

import MailIcon from '@material-ui/icons/Mail';

const useStyles = makeStyles( () => ({
  mt1: {
    marginTop: '1rem'
  },
  mt2b1: {
    marginTop: '2rem',
    marginBottom: '1rem'
  },
  statisticBox: {
    margin: '10px'
  },
  buttonBox: {
    margin: '5px'
  },
  statisticValue: {
    fontSize: '200%',
    color: '#4FBE75'
  },
  stepPaper: {
    marginTop: '1rem',
    '&:hover, &:focus': {
      backgroundColor: '#fcfcfc',
      cursor: 'pointer'
    }
  },
  mailIcon: {
    fontSize: '200%',
    color: '#4FBE75'
  },
  stepNumber: {
    margin: '20px 20px 20px 35px'
  },
  addProspectsButton: {
    float: 'right'
  },
  verticalDivider: {
    borderColor: '#EDECF2',
    height: '55px',
    width: '2px',
  },
  stepVerticalDivider: {
    borderColor: '#EDECF2',
    height: '55px',
    width: '2px',
    margin: '0 auto'
  },
  actionButton: {
    color: 'white',
    background: "linear-gradient(45deg, #2AA897 10%, #4FBE75 90%)",
    width: 75,
    height: 25,
    fontSize: 9,
    margin: 2.5,
  }
}));

const VerticalDivider = (props) => {

  const classes = useStyles();

  return (
    <Divider className={props.step ? classes.stepVerticalDivider : classes.verticalDivider} orientation="vertical" />
  )

}

const CampaignDataDisplay = (props) => {

  const classes = useStyles();

  const [sent, setSent] = useState('-');
  const [replied, setReplied] = useState('-');

  useEffect( () => {

    if(props.campaignId !== undefined) {

      // get sent for this campaign
      apiRequest('GET', `/campaign/${props.campaignId}/sent`)
      .then( json => {
        console.log(json);
        setSent(json.sent);
      })
      .catch( e => {
        console.log(e);
      });

      // get replies for this campaign
      apiRequest('GET', `/campaign/${props.campaignId}/replied`)
      .then( json => {
        console.log(json);
        setReplied(json.replied);
      })
      .catch( e => {
        console.log(e);
      });

    }

  }, [props.campaignId, props.steps]);

  return (
    <Paper className={classes.mt2b1}>
      <Grid container item
            direction="row"
            justify="space-evenly"
            alignItems="center">
        <Grid item>
          <StatisticDisplay label="Prospects"
                            value={props.prospects} />
        </Grid>
        <VerticalDivider />
        <Grid item>
          <StatisticDisplay label="Contacted"
                            value={sent} />
        </Grid>
        <VerticalDivider />
        <Grid item>
          <StatisticDisplay label="Replied"
                            value={replied} />
        </Grid>
      </Grid>
    </Paper>
  )

}

const StepsDisplay = (props) => {

  const classes = useStyles();

  return (
    props.steps ? 
    props.steps.map( (step, idx) => {
      return (
        <Paper key={idx} className={classes.stepPaper} onClick={() => props.openEditStepDialog(idx)} >
          <Grid item container
                direction="row"
                justify="space-evenly"
                alignItems="center" >
            <Grid item sm={1}>
              <Typography className={classes.stepNumber} variant="h6">{idx+1}</Typography>
            </Grid>
            <Grid item sm={1}>
              <MailIcon className={classes.mailIcon} />
            </Grid>
            <Grid item sm={2}>
              <Typography>{step.templateName}</Typography>
            </Grid>
            <Grid item sm={1}>
              <StatisticDisplay label="Prospects"
                                value={step.prospects.length} />
            </Grid>
            <Grid item sm={1}>
              <VerticalDivider step={true} />
            </Grid>
            <Grid item sm={2}>
              <StatisticDisplay label="Sent"
                                value={step.sent} />
            </Grid>
            <Grid item sm={2}>
              <ButtonBox 
                step={step} idx={idx} 
                handleProspectsClick={props.handleProspectsClick}
                handleExecuteClick={props.handleExecuteClick}
              />
            </Grid>
          </Grid>
        </Paper>
      )
    })
  : null)
}

const StatisticDisplay = (props) => {

  const classes = useStyles();

  return (
    <Box className={classes.statisticBox}>
      <Typography align="center" className={classes.statisticLabel}>{props.label}</Typography>
      <Typography align="center" className={classes.statisticValue}>{props.value}</Typography>
    </Box>
  )
}

const ButtonBox = (props) => {
  const classes = useStyles();

  return (
    <Box className={classes.buttonBox}>
      <Tooltip title="Import previous step prospects" placement="top-start">
        <Button 
        className={classes.actionButton}
        onClick={event => props.handleProspectsClick(event, props.step, props.idx)}
        >Prospects</Button> 
      </Tooltip>
      <Tooltip title="Execute the step" placement="bottom-start">
        <Button className={classes.actionButton} 
        onClick={event => props.handleExecuteClick(event, props.step)}
        >Execute</Button>
      </Tooltip>
    </Box>
  )
}

const CampaignSummary = (props) => {

  const [steps, setSteps] = useState([]);

  useEffect( () => {
    if(props.steps !== undefined) {
      getStepsSent(props.steps)
    }
  }, [props.steps])

  const getStepsSent = async (steps) => {

    const newSteps = [...steps];
    for(let [i, s] of steps.entries()) {
      const numSent = await apiRequest('GET', `/steps/${s.id}/sent`)
      .then( json => {
        return json.sent;
      })
      .catch( e => {
        console.log(e);
      });
      newSteps[i].sent = numSent;
    }
    
    setSteps(newSteps);

  }

  return (
    <Fragment>
      <Grid container
            direction="column"
            justify="flex-start"
            alignItems="stretch" >
        {/* Campaign Data */}
        <CampaignDataDisplay prospects={props.prospects} 
                             steps={props.steps}
                             campaignId={props.campaignId} />
        {/* Steps */}
        <StepsDisplay steps={steps}
                      openEditStepDialog={props.openEditStepDialog} 
                      handleProspectsClick={props.handleProspectsClick}
                      handleExecuteClick={props.handleExecuteClick}/>
      </Grid>
    </Fragment>
  )
}

export default CampaignSummary;