import * as React from 'react';

import { IMetadataCommentsService } from 'jupyterlab-metadata-service';
import { IMetadataPeopleService } from 'jupyterlab-metadata-service';

// Components
import { AppBody } from './AppBody';
import { CommentCard } from './CommentCard';
import { AppHeader } from './AppHeader';
import { AppHeaderOptions } from './AppHeaderOptions';
import { NewThreadCard } from './NewThreadCard';
import { UserSet } from './UserSet';

/**
 * React States interface
 */
interface IAppStates {
  /**
   * Card unique id that is expanded / full screen
   *
   * @type string
   */
  expandedCard: string;
  /**
   * Card unique id that has the reply active
   *
   * @type string
   */
  replyActiveCard: string;
  /**
   * Current state of the sort dropdown in the header
   *
   * @type string
   */
  sortState: string;
  /**
   * Check box state in the header
   *
   * @type boolean
   */
  showResolved: boolean;
  /**
   * State for if new thread button pressed
   *
   * @type boolean
   */
  newThreadActive: boolean;
  /**
   * File to add new thread to
   *
   * @type string
   */
  newThreadFile: string;
  /**
   * Tracks when a user is set
   *
   * @type boolean
   */
  userSet: boolean;
  /**
   * Hold the users information
   *
   * @type Person
   */
  creator: object;
  /**
   * State of threads to be rendered
   *
   * @type React.ReactNode[]
   */
  myThreads: React.ReactNode[];
  /**
   * State to hold last response
   *
   * @type any
   */
  response: any;
  /**
   * State to track when to query
   *
   * @type boolean
   */
  shouldQuery: boolean;
  /**
   * Tracks if the current target has threads or not
   *
   * @type boolean
   */
  curTargetHasThreads: boolean;
}

/**
 * React Props interface
 */
interface IAppProps {
  /**
   * Comments Service that communicates with graphql server
   *
   * @type IMetadataCommentsService
   */
  commentsService?: IMetadataCommentsService;
  /**
   * People Service that communicates with graphql server
   */
  peopleService?: IMetadataPeopleService;
  /**
   * Path of open file, used as unique id to fetch comments and annotations
   *
   * @type string
   */
  target: string;
  /**
   * Name of the open file used in the commenting header
   *
   * @type: string
   */
  targetName: string;
}

/**
 * The interval function that is used to pull in threads / comments every set interval
 */
let periodicUpdate: number;

/**
 * Main App React Component
 */
export default class App extends React.Component<IAppProps, IAppStates> {
  /**
   * Constructor
   *
   * @param props React props
   */
  constructor(props: IAppProps) {
    super(props);
    this.state = {
      expandedCard: ' ',
      replyActiveCard: ' ',
      newThreadFile: '',
      sortState: 'latest',
      showResolved: false,
      newThreadActive: false,
      userSet: false,
      shouldQuery: true,
      curTargetHasThreads: false,
      creator: {},
      myThreads: [],
      response: { data: { annotationsByTarget: { length: 0 } } }
    };

    this.getAllCommentCards = this.getAllCommentCards.bind(this);
    this.setExpandedCard = this.setExpandedCard.bind(this);
    this.checkExpandedCard = this.checkExpandedCard.bind(this);
    this.setSortState = this.setSortState.bind(this);
    this.showResolved = this.showResolved.bind(this);
    this.putComment = this.putComment.bind(this);
    this.putThread = this.putThread.bind(this);
    this.setCardValue = this.setCardValue.bind(this);
    this.setNewThreadActive = this.setNewThreadActive.bind(this);
    this.setReplyActiveCard = this.setReplyActiveCard.bind(this);
    this.checkReplyActiveCard = this.checkReplyActiveCard.bind(this);
    this.setUserInfo = this.setUserInfo.bind(this);
    this.shouldQuery = this.shouldQuery.bind(this);
    this.getNewThreadButton = this.getNewThreadButton.bind(this);
  }

  /**
   * Called when the component will mount
   */
  componentWillMount() {
    // Sets the interval of when to periodically query for comments
    periodicUpdate = setInterval(this.shouldQuery, 1000);
  }

  /**
   * Called when component will unmount
   */
  componentWillUnmount() {
    // Stops the periodic query of comments
    clearInterval(periodicUpdate);
  }

  /**
   * Called each time the component updates
   */
  componentDidUpdate(): void {
    // Queries new data if there is a new target
    if (this.state.response.data.annotationsByTarget !== undefined) {
      if (this.state.response.data.annotationsByTarget.length !== 0) {
        if (
          this.state.response.data.annotationsByTarget[0].target !==
            this.props.target &&
          !this.state.shouldQuery
        ) {
          this.setState({
            expandedCard: ' ',
            newThreadActive: false,
            shouldQuery: true
          });
        }
      }
    }

    // Handles querying new data
    if (this.state.shouldQuery) {
      if (this.props.target !== undefined) {
        this.props.commentsService
          .queryAllByTarget(this.props.target)
          .then((response: any) => {
            if (response.data.annotationsByTarget.length !== 0) {
              this.setState({
                myThreads: this.getAllCommentCards(
                  response.data.annotationsByTarget
                ),
                response: response,
                shouldQuery: false,
                curTargetHasThreads: true
              });
            } else {
              this.state.myThreads.length !== 0 &&
                this.setState({
                  myThreads: [],
                  shouldQuery: false,
                  curTargetHasThreads: false,
                  newThreadActive: false
                });
            }
          });
      }
    }

    // Handles when there is no target
    if (this.props.target === undefined) {
      this.state.myThreads.length !== 0 &&
        this.setState({
          myThreads: [],
          shouldQuery: false,
          curTargetHasThreads: false,
          newThreadActive: false
        });
    }
  }

  /**
   * React render function
   */
  render() {
    return this.state.userSet ? (
      <div className="--jp-commenting-window">
        <AppHeader
          header={this.props.targetName}
          cardExpanded={this.state.expandedCard !== ' '}
          threadOpen={this.state.newThreadActive}
          setExpandedCard={this.setExpandedCard}
          headerOptions={
            <AppHeaderOptions
              setSortState={this.setSortState}
              showResolvedState={this.showResolved}
              cardExpanded={this.state.expandedCard !== ' '}
              header={this.props.targetName}
              hasThreads={this.state.curTargetHasThreads}
              showResolved={this.state.showResolved}
              sortState={this.state.sortState}
            />
          }
        />
        <AppBody
          cards={
            this.state.newThreadActive
              ? [
                  <NewThreadCard
                    putThread={this.putThread}
                    setNewThreadActive={this.setNewThreadActive}
                    creator={this.state.creator}
                  />
                ]
              : this.state.myThreads
          }
          expanded={this.state.expandedCard !== ' '}
          newThreadButton={
            this.state.newThreadActive || this.props.target === undefined
              ? undefined
              : this.getNewThreadButton()
          }
        />
      </div>
    ) : (
      <div className="--jp-commenting-window">
        <UserSet setUserInfo={this.setUserInfo} />
      </div>
    );
  }

  /**
   * Creates and returns all CommentCard components with correct data
   *
   * @param allData Type: any - Comment data from this.props.data
   * @return Type: React.ReactNode[] - List of CommentCard Components / ReactNodes
   */
  getAllCommentCards(allData: any): React.ReactNode[] {
    let cards: React.ReactNode[] = [];
    for (let key in allData) {
      if (
        this.shouldRenderCard(
          allData[key].resolved,
          this.state.expandedCard !== ' ',
          this.state.expandedCard === allData[key].id
        )
      ) {
        cards.push(
          <CommentCard
            data={allData[key]}
            threadId={allData[key].id}
            setExpandedCard={this.setExpandedCard}
            checkExpandedCard={this.checkExpandedCard}
            setReplyActiveCard={this.setReplyActiveCard}
            checkReplyActiveCard={this.checkReplyActiveCard}
            resolved={allData[key].resolved}
            putComment={this.putComment}
            setCardValue={this.setCardValue}
            target={this.props.target}
          />
        );
      }
    }
    return cards.reverse();
  }

  /**
   * JSX of new thread button
   *
   * @return Type: React.ReactNode - New thread button
   */
  getNewThreadButton(): React.ReactNode {
    return (
      <div
        className="newThreadCard"
        onClick={() => this.setNewThreadActive(true)}
      >
        <span className="newThreadLabel">New Comment Thread</span>
        <span
          className={
            'newThreadButton jp-AddIcon jp-Icon jp-ToolbarButtonComponent-icon jp-Icon-16'
          }
        />
      </div>
    );
  }

  /**
   * Checks if a card should be rendered in based on the states of
   * the current view
   *
   * @param resolved Type: boolean - resolved state of the card
   * @param expandedCard Type: boolean - State if there is a card expanded
   * @param curCardExpanded Type: boolean - State if the current card is expanded
   */
  shouldRenderCard(
    resolved: boolean,
    expandedCard: boolean,
    curCardExpanded: boolean
  ): boolean {
    if (!this.state.showResolved) {
      if (!resolved) {
        if (expandedCard) {
          return curCardExpanded;
        }
        return true;
      } else {
        return false;
      }
    } else {
      if (expandedCard) {
        return curCardExpanded;
      }
      return true;
    }
  }

  /**
   * Sets the state should query to query when component updates
   */
  shouldQuery(): void {
    this.setState({ shouldQuery: true });
  }

  /**
   * Pushed comment back to MetadataCommentsService
   *
   * @param value Type: string - comment message
   * @param threadId Type: string - commend card / thread the comment applies to
   */
  putComment(threadId: string, value: string): void {
    this.props.commentsService.createComment(
      threadId,
      value,
      this.state.creator
    );
    this.shouldQuery();
  }

  /**
   * Pushes new thread to GraphQL server
   *
   * @param value Type: string - comment message
   * @param label Type: string - label / tag of a thread
   */
  putThread(value: string): void {
    this.props.commentsService.createThread(
      this.props.target,
      value,
      this.state.creator
    );
    this.shouldQuery();
  }

  /**
   * Used to set a specific field of a card
   *
   * @param target Type: string - id of a thread
   * @param threadId Type: string - id of a specific card
   * @param key Type: string - key of value to set
   * @param value Type: string - value to set
   */
  setCardValue(target: string, threadId: string, value: boolean): void {
    this.props.commentsService.setResolvedValue(target, threadId, value);
  }

  /**
   * Used to check if the cardId passed in is the current expanded card
   *
   * @param threadId Type: string - CommentCard unique id
   * @return Type: boolean - True if cardId is expanded, false if cardId is not expanded
   */
  checkExpandedCard(threadId: string): boolean {
    return threadId === this.state.expandedCard;
  }

  /**
   * Sets this.state.expandedCard to the passed in cardId
   *
   * @param threadId Type: string - CommentCard unique id
   */
  setExpandedCard(threadId: string) {
    this.setState({ expandedCard: threadId });
    this.shouldQuery();
  }

  /**
   * Sets this.state.replyActiveCard to the passed in cardId
   *
   * @param threadId Type: string - CommentCard unique id
   */
  setReplyActiveCard(threadId: string) {
    this.setState({ replyActiveCard: threadId });
    this.shouldQuery();
  }

  /**
   * Used to check if the cardId passed in has reply box active
   *
   * @param threadId Type: string - CommentCard unique id
   * @return type: boolean - True if cardId has reply box open, false if not active
   */
  checkReplyActiveCard(threadId: string): boolean {
    return threadId === this.state.replyActiveCard;
  }

  /**
   * Sets this.state fields for active new thread card
   *
   * @param state Type: boolean - State to set if new thread card is active
   * @param target Type: string - target of the file to add new thread to
   */
  setNewThreadActive(state: boolean) {
    this.setState({ newThreadActive: state });
    this.setState({ newThreadFile: this.props.target });
    this.shouldQuery();
  }

  /**
   * Sets this.state.sortState to the selected sort by
   *
   * @param state Type: string - Sort by type
   */
  setSortState(state: string) {
    this.setState({ sortState: state });
    this.shouldQuery();
  }

  /**
   * Sets this.state.showResolved to the state of the checkbox
   * "Show resolved"
   */
  showResolved(state: boolean) {
    this.setState({ showResolved: state });
    this.shouldQuery();
  }

  /**
   * Uses Github API to fetch users name and photo
   *
   * @param user Type: string - users github username
   */
  async setUserInfo(user: string) {
    const response = await fetch('https://api.github.com/users/' + user);
    const myJSON = await response.json();

    // If users does not have a name set, use username
    const name = myJSON.name === null ? myJSON.login : myJSON.name;
    if (myJSON.message !== 'Not Found') {
      this.props.peopleService.queryAll().then((response: any) => {
        if (response.data.people.length !== 0) {
          for (let index in response.data.people) {
            if (
              response.data.people[index].name === name &&
              !this.state.userSet
            ) {
              this.setState({
                creator: {
                  id: response.data.people[index].id,
                  name: name,
                  image: myJSON.avatar_url
                },
                userSet: true
              });
            }
          }
          if (!this.state.userSet) {
            this.props.peopleService.create(name, '', myJSON.avatar_url);
            let personCount: number = Number(response.data.people.length + 2);
            this.setState({
              creator: {
                id: 'person/' + personCount,
                name: name,
                image: myJSON.avatar_url
              },
              userSet: true
            });
          }
        }
      });
    } else {
      window.alert('Username not found');
    }
  }
}
