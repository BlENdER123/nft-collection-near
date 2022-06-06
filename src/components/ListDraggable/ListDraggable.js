import React, {Component} from "react";
import ReactDOM from "react-dom";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle, active) => {
  // some basic styles to make the items look a bit nicer
  //userSelect: "none",

  return {
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    border: active ? "1px solid #6333ff" : "1px solid #444",
    borderRadius: "2px",
    color: "#fff",

    // change background colour if dragging
    background: isDragging ? "#384a5d" : "#282a2d",

    // styles we need to apply on draggables
    //transitionDuration: `0.001s`,
    ...draggableStyle,
  };
};

const getListStyle = (isDraggingOver) => ({
  //background: isDraggingOver ? "lightblue" : "lightgrey",
  //padding: grid,
  width: "100%",
});

class ListDraggable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.list,
      openSnack: false,
      indexRemoveLayer: 0,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickActive = this.handleClickActive.bind(this);
    this.handleClickSnack = this.handleClickSnack.bind(this);
    this.handleCloseSnack = this.handleCloseSnack.bind(this);
    this.handleRemoveSnack = this.handleRemoveSnack.bind(this);
  }

  handleClick(s, l, active) {
    const style = getItemStyle(s, l, active);
    //console.log("style", style);
    return style;
  }

  handleClickActive(index) {
    //console.log(this.state.items);

    let lst = this.state.items.map((e, i) => {
      let n = e;
      i == index ? (n.active = true) : (n.active = false);
      return n;
    });
    this.setState({items: lst});
    this.props.callbackChangeActive(index);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index,
    );

    this.setState({
      items,
    });
    this.props.callbackChangePosition(items);
  }

  handleClickSnack = (index) => {
    this.setState({openSnack: true, indexRemoveLayer: index});
  };

  handleRemoveSnack = () => {
    let tempArr = this.state.items.slice();
    tempArr.splice(this.state.indexRemoveLayer, 1);
    console.log("DELETE LAYER", tempArr);
    this.setState({items: tempArr});
    this.props.callbackRemoveLayer(this.state.indexRemoveLayer);
  };

  handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({openSnack: false});
  };

  action = (
    <React.Fragment>
      <Button
        color="error"
        variant="contained"
        size="small"
        onClick={this.handleRemoveSnack}
      >
        DELETE
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={this.handleCloseSnack}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  render() {
    return (
      <>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {this.state.items.map((item, index) => (
                  <Draggable
                    key={item.name}
                    draggableId={item.name}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        onClick={() => this.handleClickActive(index)}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={this.handleClick(
                          snapshot.isDragging,
                          provided.draggableProps.style,
                          item.active,
                        )}
                      >
												<span
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
													<span>{item.name}</span>
													<IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={() => this.handleClickSnack(index)}
                          >
														<CloseIcon fontSize="small" />
													</IconButton>
												</span>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Snackbar
          open={this.state.openSnack}
          autoHideDuration={6000}
          onClose={this.handleCloseSnack}
          message={
            "You confirm to delete the layer- " +
            this.state.items[this.state.indexRemoveLayer].name +
            " ?"
          }
          action={this.action}
          // anchorOrigin={{vertical: "top", horizontal: "center"}}
        />
      </>
    );
  }
}

export default ListDraggable;