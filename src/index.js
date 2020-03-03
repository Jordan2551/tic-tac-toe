import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


function Square(props){
    function handleSquareClick(){
        props.squareClick(props.r, props.c);
    }
    return (
    <button className="square" onClick={handleSquareClick}>
        {props.value}
    </button>
    );
  }
  
  function Board(props){
        function renderSquare(r,c) {
            return <Square value={props.grid[r][c]} r={r} c={c} squareClick={props.squareClick} />;
        }
        return(
            <div>
                <div className="status">{props.status}</div>
                <div className="board-row">
                {renderSquare(0,0)}
                {renderSquare(0,1)}
                {renderSquare(0,2)}
                </div>
                <div className="board-row">
                {renderSquare(1,0)}
                {renderSquare(1,1)}
                {renderSquare(1,2)}
                </div>
                <div className="board-row">
                {renderSquare(2,0)}
                {renderSquare(2,1)}
                {renderSquare(2,2)}
                </div>
            </div>
        );
    }
  
  class Game extends React.Component {

    constructor(props){
        super(props);
        var grid =
        [
            [null,null,null],
            [null,null,null],
            [null,null,null]
        ];
        var history = [{grid}];
        this.state = {
            grid: grid,
            history: history, 
            turnX: true, 
            gameOver: false, 
            winner: null,
            status: "Playing now: X"
        }
    }

    squareClick(r,c){
        if(this.state.gameOver == false && this.state.grid[r][c] == null){
            //Deep copy of tempGrid (we will use this later for undo-redo)
            let tempGrid = this.state.grid.slice();
            tempGrid[r][c] = this.state.turnX ? 'X' : 'O';
            let turn = !this.state.turnX;
            this.calculateWinner(tempGrid);
            this.setState({grid: tempGrid, turnX : turn});
         }       
    }

    calculateWinner(grid){
        var winFound = false;
        for(var r = 0; r < grid.length; r++){
            if(grid[r][0] == 'X' && grid[r][1] == 'X' && grid[r][2] == 'X')
                winFound = true;
            else if(grid[r][0] == 'O' && grid[r][1] == 'O' && grid[r][2] == 'O')
                winFound = true;
            if(grid[0][r] == 'X' && grid[1][r] == 'X' && grid[2][r] == 'X')
                winFound = true;
            if(grid[0][r] == 'O' && grid[1][r] == 'O' && grid[2][r] == 'O')
                winFound = true;
        }
        if(grid[0][0] == 'X' && grid[1][1] == 'X' && grid[2][2] == 'X')
            winFound = true;
        if(grid[0][0] == 'O' && grid[1][1] == 'O' && grid[2][2] == 'O')
            winFound = true;
        if(grid[0][2] == 'X' && grid[1][1] == 'X' && grid[2][0] == 'X')
            winFound = true;
        if(grid[0][2] == 'O' && grid[1][1] == 'O' && grid[2][0] == 'O')
            winFound = true;

        if(winFound)
            this.setState({gameOver : true, status: "Game is over! Player " + (this.state.turnX ? 'X' : 'O') + " has won."}) 
        else
            this.setState({status: 'Playing now: ' + (this.state.turnX ? 'O' : 'X')});

    }
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board grid={this.state.grid} squareClick={this.squareClick.bind(this)} status={this.state.status} />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  


ReactDOM.render(<Game />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
