import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function findWinner(squares) {
  // rows, columns or diagonals
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // squares should not be null and contain same value
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  // undecided
  return null;
}


function Square(props) {
  return (
    <button className="square" onClick = {() => props.onClick()}>
      { props.value }
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square
      key={i}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }

  renderRow(i, k){
    const squares = [] // list of k squares rendered on row i
    for (var j = 0; j < k; j++) {
      squares.push(this.renderSquare(i+j));
    }

    return (
      <div key={i} className="board-row">
      { squares }
      </div>
    )
  }

  render() {
    const rows = []
    for (var i = 0; i < 3; i++) {
      rows.push(this.renderRow(i * 3, 3));
    }

    return (
      <div>
        { rows }
      </div>
    );
  }
}

class Game extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null), // empty board
      }],
      xIsNext: true, // X starts the game
      winner: null, // no winner
    };
  }

  handleClick(i) {

    // copy squares from state
    const history = this.state.history;
    const squares = history[history.length - 1].squares.slice(); // copy last state
    
    // skip updates if square already populated or game finished
    if (squares[i] || findWinner(squares))
      return;

    // update square
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    
    // check winner state
    const winner = findWinner(squares);
    
    // push new state to history
    history.push({squares: squares});

    // render the board again
    this.setState({
      history: history, // replace history
      xIsNext: !this.state.xIsNext, // update next player
      winner: winner, // update winner state
    });
  }

  jumpTo(step) {
    const history = this.state.history.slice(0, step + 1); // purge history after step
    const squares = history[step].squares;
    const winner = findWinner(squares); // find winner (if exists on current state)
    
    this.setState({
      history: history,
      xIsNext: step % 2 === 0, // X plays on even moves
      winner: winner,
    });
  }

  render() {

    const history = this.state.history;
    const current = history[history.length - 1];

    let status;
    if (this.state.winner) {
      status = 'Winner: ' + this.state.winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((step, index) => {
      const desc = index ?
        'Go to move #' + index :
        'Go to game start';
      return (
        <li key={index}>
          <button onClick={() => this.jumpTo(index)}>{desc}</button>
        </li>
      );
    });


    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
