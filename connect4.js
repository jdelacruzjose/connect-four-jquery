class Connect4{
    constructor(selector){
        this.ROWS = 6;
        this.COLS = 7;
        this.player = 'red';
        this.selector = selector;
        this.createGrid();
        this.setupEventListeners();
    }

    createGrid(){
        const $board = $(this.selector);
        
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
            const cells = $(`.col[data-col='${col}']`)
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
            const col = $(this).data('col');
            const $lastEmptyCell = findLastEmptyCell(col);
            $lastEmptyCell.removeClass(`empty next-${that.player}`);
            $lastEmptyCell.addClass(that.player);
            that.player = (that.player === 'red') ? 'black' : 'red';
            $(this).trigger('mouseenter');
        });
    }
} 