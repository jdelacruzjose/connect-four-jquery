class Connect4{
    constructor(selector){
        this.ROWS = 6;
        this.COLS = 7;
        this.player = 'red';
        this.selector = selector;
        this.isGameOver = false;
        this.onPlayerMove = function(){};
        this.createGrid();
        this.setupEventListeners();
    }

    createGrid(){
        const $board = $(this.selector);
        $board.empty();
        this.isGameOver = false;
        this.player = 'red';
        
        //Nested For-Loop Function to create rows/columns
        //attr() jquery method adds a value to the selected element 
        for (let row = 0; row < this.ROWS; row++){
            const $row = $('<div>')
            .addClass('row');
            for(let col = 0; col < this.COLS; col++){
                const $col = $('<div>')
                .addClass('col empty')
                .attr('data-col', col)
                .attr('data-row', row)
                $row.append($col);
            }
            $board.append($row);
        }
    }
    
    setupEventListeners(){
        const $board = $(this.selector);
        const that = this;

        //Function to iterate the columns to select last cell
        function findLastEmptyCell(col){
            const cells = $(`.col[data-col='${col}']`);
            for(let i = cells.length -1; i>= 0; i--){
                const $cell = $(cells[i]);
                if($cell.hasClass('empty')){
                    return $cell;
                }
            }
            return null
        }

        //Hover CSS Styling function
        $board.on('mouseenter', '.col.empty', function(){
            if(that.isGameOver) return;
            const col = $(this).data('col');
            const $lastEmptyCell = findLastEmptyCell(col);
            $lastEmptyCell.addClass(`next-${that.player}`);
        });

        //Hover Off CSS Styling function
        $board.on('mouseleave', '.col', function(){
            $('.col').removeClass(`next-${that.player}`);
        });

        //onClick CSS Styling Function
        $board.on('click', '.col.empty', function(){
            if(that.isGameOver) return;
            const col = $(this).data('col');
            // const row = $(this).data('row');
            const $lastEmptyCell = findLastEmptyCell(col);
            $lastEmptyCell.removeClass(`empty next-${that.player}`);
            $lastEmptyCell.addClass(that.player);
            $lastEmptyCell.data('player', that.player);

            const winner = that.checkForWinner(
                $lastEmptyCell.data('row'), 
                $lastEmptyCell.data('col'))
            if (winner){
                that.isGameOver = true;
                alert(`Game Over! Player ${that.player} has won!`);
                $('.col.empty').removeClass('empty');
                return;
            }

            that.player= (that.player === 'red') ? 'black' : 'red';
            that.onPlayerMove();
            $(this).trigger('mouseenter');
            });
        }   

        //CheckWinner Logic
        checkForWinner(row, col){
        const that = this; 

        function $getCell(a, b){
           return $(`.col[data-row ='${a}'][data-col ='${b}']`);
        } 

        function checkDirection(direction){
            let total = 0;
            let a = row + direction.a;
            let b = col + direction.b;
            let $next = $getCell(a, b);
            while(a >= 0 &&
                a < that.ROWS &&
                b >= 0 &&
                b < that.COLS &&
                $next.data('player') === that.player){
                    total++;
                    a += direction.a;
                    b += direction.b;
                    $next = $getCell(a, b);
                }
            return total;    
        }

        function checkWin(directionA, directionB){
            const total = 1 +
                checkDirection(directionA) +
                checkDirection(directionB);
             if (total >= 4){
                 return that.player;
             } else {
                 return null;
             }
        }

        function checkDiagonalBLtoTR(){
            return checkWin({a: 1, b: -1}, {a: 1, b: 1})
        }

        function checkDiagonalTLtoBR(){
            return checkWin({a: 1, b: 1}, {a: 1, b: -1})
        }

        function checkVerticals(){
            return checkWin({a: -1, b: 0}, {a: 1, b:0});
        }

        function checkHorizontals(){
            return checkWin({a: 0, b: -1}, {a: 1, b:0});
        }

        return checkVerticals() || checkHorizontals() || checkDiagonalBLtoTR() || checkDiagonalTLtoBR();
        }
        
        restart(){
            this.createGrid();
            this.onPlayerMove();
        }
} 