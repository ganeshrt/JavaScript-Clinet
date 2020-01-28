import React from 'react';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import moment from 'moment';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';
import { withApollo, Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from './Components/Table/Table';
import trainees from './data/trainee';
import AddDialog from './Components/AddDialog/AddDialog';
import EditDialog from './Components/EditDialog/EditDialog';
import RemoveDialog from './Components/RemoveDialog/RemoveDialog';
import { WithSnackBarConsumer } from '../../contexts';
import { callAPI } from '../../lib/utils/api';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    flexGrow: '1',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});

export const TableContext = React.createContext();
class TraineeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      close: false,
      order: 'asc',
      orderBy: '',
      pageNo: 0,
      id: '',
      editOpen: true,
      openEditDialog: false,
      closeEditDialog: false,
      closeRemoveDialog: false,
      openRemoveDialog: false,
      openSuccess: false,
      closeSuccess: false,
      data: [],
      dataLength: 0,
      limit: 100,
      skip: 250,
      loading: true,
    };
  }

  handleClickOpen = () => {
    this.setState({
      open: true,
      close: false,
    });
  };

  handleClose = () => () => {
    this.setState(
      {
        open: false,
        close: true,
        openSuccess: true,
        closeSuccess: false,
      },
      this.reLoadtable,
    );
  };

  handleEditDialogClose = () => () => {
    this.setState(
      {
        openEditDialog: false,
      },
      this.reLoadtable,
    );
  };

  handleRemoveDialogClose = () => () => {
    this.setState(
      {
        openRemoveDialog: false,
      },
      this.reLoadtable,
    );
  };

  handleSelect = () => {};

  handleChangePage = (event, newPage) => {
    const { skip } = this.state;

    this.setState(
      {
        pageNo: newPage,
        skip: skip + 10,
      },
      this.reLoadtable,
    );
  };

  getList() {
    const { match } = this.props;
    return trainees.map(item => (
      <li>
        <Link to={`${match.url}/${item.id}`} key={item.id}>
          {item.name}
        </Link>
      </li>
    ));
  }

  handleEditDialogOpen = (id) => {
    this.setState({
      openEditDialog: true,
      closeEditDialog: false,
      id,
    });
  };

  handleDeleteDialogOpen = (id) => {
    this.setState({
      openRemoveDialog: true,
      closeRemoveDialog: false,
      name: id.name,
      email: id.email,
      id,
    });
  };

  componentDidMount = () => {
    this.reLoadtable();
    // this.callApolloServer;
  };

  SUB_QUERY = gql`
    subscription {
      newUser {
        name
        email
        originalId
        createdAt
      }
    }
  `;

  _subscribeToNewLinks = (subscribeToMore) => {
    console.log('_subscribeToNewLinks');
    subscribeToMore({
      document: gql`
        subscription {
          newUser {
            name
            email
            originalId
            createdAt
          }
        }
      `,
      updateQuery: (prev, { subscriptionData }) => {
        console.log('prev :', prev, 'subscriptionData', subscriptionData);
        if (!subscriptionData.data) return prev.getData;
        const { newUser } = subscriptionData.data;
        const exists = prev.getData.find(
          ({ originalId }) => originalId === newUser.originalId,
        );
        if (exists) return prev.getData;

        return Object.assign({}, prev, {
          getData: {
            links: [newUser, ...prev.getData],
            count: prev.getData.links.length + 1,
            __typename: prev.__typename,
          },
        });
      },
    });
  };

  async reLoadtable() {
    // const { skip, limit } = this.state;
    // const url = 'https://express-training.herokuapp.com/api/trainee/get';

    this.setState({
      loading: true,
    });
    const QUERY = gql`
      {
       // getName @client

getData(limit : 100,skip : 200){
  name
  originalId
  email
}
      }
    `;
    try {
      console.log(' reloadtable:');

      // const res = await callAPI({
      //   url,
      //   method: 'get',
      //   params: { skip, limit },
      // });

      this.props.client
        .query({
          query: QUERY,
          variables: {},
        })
        .then((res) => {
          console.log('query res :', res);
          const { data } = this.state;
          this.setState({
            loading: false,
            //  data: res.data.getData,
          });
          console.log('query res :', data);
          // this._subscribeToNewLinks(subscribeToMore);
        });
    } catch (err) {
      console.log('res : ', err);
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    const {
      open,
      order,
      orderBy,
      pageNo,
      openEditDialog,
      id,
      openRemoveDialog,
      data,
      loading,
    } = this.state;
    const { match } = this.props;
    console.log('client :', this.props.client);
    const getFormattedDate = val => moment(val).format('dddd,MMMM Do YYYY, h:mm:ss a');
    const handleSort = (e, property) => {
      const isDesc = orderBy === property && order === 'desc';
      this.setState({
        order: isDesc ? 'asc' : 'desc',
        orderBy: property,
      });
    };

    return (
      <Grid>
        <Grid container>
          <Grid item xs={12}>
            <Grid container justify="flex-end" spacing={0}>
              <Button
                variant="outlined"
                color="primary"
                style={{ margin: '20px' }}
                onClick={this.handleClickOpen}
              >
                Add TraineeList
              </Button>
            </Grid>
          </Grid>

          <AddDialog open={open} onClose={this.handleClose()} />
          <EditDialog
            open={openEditDialog}
            onClose={this.handleEditDialogClose()}
            id={id}
          />
          <RemoveDialog
            open={openRemoveDialog}
            onClose={this.handleRemoveDialogClose()}
            id={id}
          />
          <Query
            query={gql`
      {
        getData(limit: ${this.state.limit}, skip:${this.state.skip}) {
          name
          email
          originalId
          createdAt
        }
      }
    `}
            // pollInterval={500}
          >
            {({
 loading, data, error, subscribeToMore, client 
}) => {
              this._subscribeToNewLinks(subscribeToMore);
              if (loading) {
                return (
                  <div>
                    {' '}
                    <CircularProgress
                      size={24}
                      className={this.props.classes.buttonProgress}
                    />
                  </div>
                );
              }
              if (error) {
                return (
                  <center>
                    <h2>OOPS!</h2>
                  </center>
                );
              }
              console.log('aaaa...', data);
              client.writeData({
                data: {
                  getData: data.getData,
                },
              });
              // console.log(client.readData({ data }));
              return (
                <Table
                  id="table"
                  data={data.getData}
                  columns={[
                    { field: 'name', label: 'Name' },
                    {
                      field: 'email',
                      label: 'Email Address',
                      format: value => value && value.toUpperCase(),
                    },
                    {
                      field: 'createdAt',
                      label: 'Date',
                      align: 'right',
                      format: getFormattedDate,
                    },
                  ]}
                  order={order}
                  orderBy={orderBy}
                  onSort={handleSort}
                  onSelect={this.handleSelect}
                  actions={[
                    {
                      icon: <EditIcon />,
                      handler: this.handleEditDialogOpen,
                    },
                    {
                      icon: <DeleteIcon />,
                      handler: this.handleDeleteDialogOpen,
                    },
                  ]}
                  count={400}
                  page={pageNo}
                  onChangePage={this.handleChangePage}
                  match={match}
                  loader={loading}
                  dataLength={data.length}
                />
              );
            }}
          </Query>
        </Grid>
      </Grid>
    );
  }
}
export default withApollo(
  WithSnackBarConsumer(withStyles(styles)(TraineeList)),
);
