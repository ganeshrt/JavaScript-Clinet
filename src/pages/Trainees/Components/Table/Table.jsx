import React from 'react';
import MuTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { Grid, IconButton, TablePagination } from '@material-ui/core';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withLoaderAndMessage } from '../../../../components/HOC/withLoaderAndMessage';
import { TableContext } from '../../TraineeList';
// import TablePagination from 'materialui-pagination'
const styles = theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    overflowX: 'auto',
    margin: theme.spacing(5),
  },
  table: {
    minWidth: 650,
  },
  tblRow: {
    backgroundColor: '#f2f2f2',
  },
  link: {
    color: 'black',
    textDecoration: 'none',
  },
  buttonProgress: {
    // color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    // marginTop: -40,
    // marginLeft: -12,
  },
});

class Table extends React.Component {
  state = {
    openEditDialog: false,
    closeEditDialog: false,
  };

  createSortHandler = property => (e) => {
    console.log('event', e);
    this.props.onSort(e, property);
  };

  onClickHandler(name, handler) {
    handler(true);
  }

  handleClickOpen = (handler, val) => (e) => {
    console.log(val);
    handler(val);
  };

  getRow() {
    const {
      columns,
      data,
      classes,
      order,
      match,
      actions,
      count,
      onChangePage,
      page,
      loading,
      dataLength,
    } = this.props;
    console.log('data :', this.props.data);

    return (
      <>
        {loading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
        {dataLength <= 0 && !loading ? (
          <center>
            {/* <h1> OOPS!</h1> */}
            <CircularProgress size={24} className={classes.buttonProgress} />
          </center>
        ) : (
          <>
            <TableHead>
              <TableRow hover>
                {columns.map((item) => {
                  const { label, align, field } = item;
                  return (
                    <TableCell align={align}>
                      <TableSortLabel
                        direction={order}
                        onClick={this.createSortHandler(field)}
                      />
                      {label}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={item.name} hover selected={index % 2 === 0}>
                  {columns.map((val) => {
                    const { align, field, format } = val;
                    return (
                      <TableCell align={align}>
                        <TableContext.Provider
                          value={{ data: this.props.date }}
                        >
                          <Link
                            className={classes.link}
                            to={`${match.url}/${item.originalId}`}
                            key={item.originalId}
                          >
                            {format ? format(item[field]) : item[field]}
                          </Link>
                        </TableContext.Provider>
                        {actions.map(e => (field === "createdAt" ? (
                            <IconButton
                              onClick={this.handleClickOpen(e.handler, item)}
                            >
                              {e.icon}
                            </IconButton>
                          ) : (
                            ""
                          )),)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>

            <TablePagination
              rowsPerPageOptions={10}
              count={count}
              rowsPerPage={20}
              page={page}
              onChangePage={onChangePage}
              backIconButtonProps={{
                'aria-label': 'Previous Page',
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page',
              }}
            />
          </>
        )}
      </>
    );
  }

  render() {
    const { id, data, classes } = this.props;
    console.log('data :', data);

    return (
      <Grid container xs={12} className={classes.root}>
        <Paper className={classes.paper}>
          <MuTable className={classes.table} key={id}>
            {this.getRow()}
          </MuTable>
        </Paper>
      </Grid>
    );
  }
}

export default withLoaderAndMessage(withStyles(styles)(Table));
