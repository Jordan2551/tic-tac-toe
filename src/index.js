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
        var history = new Array();
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
        if(this.state.gameOver === false && this.state.grid[r][c] === null){
            const turnMark = this.state.turnX ? 'X' : 'O';
            this.state.grid[r][c] = turnMark;
            this.state.history.push(this.recordMove(turnMark, r, c));
            let turn = !this.state.turnX;
            this.calculateWinner(this.state.grid);
            this.setState({grid: this.state.grid, turnX : turn});
         }       
    }

    calculateWinner(grid){
        var winFound = false;
        for(var r = 0; r < grid.length; r++){
            if(grid[r][0] === 'X' && grid[r][1] === 'X' && grid[r][2] === 'X')
                winFound = true;
            else if(grid[r][0] === 'O' && grid[r][1] === 'O' && grid[r][2] === 'O')
                winFound = true;
            if(grid[0][r] === 'X' && grid[1][r] === 'X' && grid[2][r] === 'X')
                winFound = true;
            if(grid[0][r] === 'O' && grid[1][r] === 'O' && grid[2][r] === 'O')
                winFound = true;
        }
        if(grid[0][0] === 'X' && grid[1][1] === 'X' && grid[2][2] === 'X')
            winFound = true;
        if(grid[0][0] === 'O' && grid[1][1] === 'O' && grid[2][2] === 'O')
            winFound = true;
        if(grid[0][2] === 'X' && grid[1][1] === 'X' && grid[2][0] === 'X')
            winFound = true;
        if(grid[0][2] === 'O' && grid[1][1] === 'O' && grid[2][0] === 'O')
            winFound = true;

        if(winFound)
            this.setState({gameOver : true, status: "Game is over! Player " + (this.state.turnX ? 'X' : 'O') + " has won."}) 
        else
            this.setState({status: 'Playing now: ' + (this.state.turnX ? 'O' : 'X')});

    }

    recordMove = (player, r, c) =>{
        return({player: player, r: r, c: c});
    }
    
    undoMove(move){
        //Case: the game is over therefore we need to resume the game!
        var modGrid = this.state.grid;
        var newHistory = this.state.history;
        const numOfUndos = newHistory.findIndex((element) => element === move);
        //Undo grid # of moves gone back on the grid!
        for(var i = numOfUndos; i < newHistory.length; i++){
            modGrid[newHistory[i].r][newHistory[i].c] = null;
        }
        //Remove the histories to correspond to the new board.
        console.log(numOfUndos);
        newHistory = newHistory.slice(0, numOfUndos);
        var gameOver = this.state.gameOver;
        if(gameOver)
            gameOver = false;
        this.setState({
            gameOver: gameOver,
            turnX: move.player === 'X' ? true : false,
            grid: modGrid,
            history: newHistory,
            status: 'Playing now: ' + (this.state.turnX ? 'O' : 'X')
        });
    }

    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board grid={this.state.grid} squareClick={this.squareClick.bind(this)}/>
          </div>
          <div className="game-info">
            <div>{this.state.status}</div>
            <ol>
                {this.state.history.map((move, index)=>{return <li key={index}><button onClick={this.undoMove.bind(this, move)}>Move by: {move.player} @ ({move.r},{move.c})</button></li>})}
            </ol> 
          </div>
        </div>
      );
    }
  }
  

 

  // ============================================================
  
  


ReactDOM.render(<Game />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
