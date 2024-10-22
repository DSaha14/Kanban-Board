
import React, { useState, useEffect } from 'react';
import { fetchTickets } from '../services/api';
import displayIcon from "../Untitled/icons_FEtask/Display.svg";
import highPriorityIcon from "../Untitled/icons_FEtask/Img - High Priority.svg";
import lowPriorityIcon from "../Untitled/icons_FEtask/Img - Low Priority.svg";
import mediumPriorityIcon from "../Untitled/icons_FEtask/Img - Medium Priority.svg";
import urgentIcon from "../Untitled/icons_FEtask/SVG - Urgent Priority colour.svg";
import noPriorityIcon from "../Untitled/icons_FEtask/No-priority.svg";
import backlogIcon from "../Untitled/icons_FEtask/Backlog.svg";
import todoIcon from "../Untitled/icons_FEtask/To-do.svg";
import inProgressIcon from "../Untitled/icons_FEtask/in-progress.svg";
import doneIcon from "../Untitled/icons_FEtask/Done.svg";
import cancelledIcon from "../Untitled/icons_FEtask/Cancelled.svg";
import add from "../Untitled/icons_FEtask/add.svg";
import dot from "../Untitled/icons_FEtask/3 dot menu.svg";


const KanbanBoard = () => {
  const [displayOptions, setDisplayOptions] = useState(false);
  const [groupBy, setGroupBy] = useState("priority");
  const [sortBy, setSortBy] = useState("priority");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskDetailsVisible, setTaskDetailsVisible] = useState({});


  const toggleDisplayOptions = () => {
    setDisplayOptions(!displayOptions);
  };
  

  const getPriorityIcon = (priority) => {
    switch (String(priority).toLowerCase()) {
        case '4':
        return urgentIcon;
      case '3':
        return highPriorityIcon;
      case '2':
        return mediumPriorityIcon;
      case '1':
        return lowPriorityIcon;
      case '0':
        return noPriorityIcon;
      default:
        return null;
    }
  };

  const formatPriorityLabel = (priority) => {
    switch (String(priority).toLowerCase()) {
        case '4':
            return 'Urgent';
      case '3':
        return 'High';
      case '2':
        return 'Medium';
      case '1':
        return 'Low';
      case '0':
        return 'No Priority';
      default:
        return priority;
    }
  };

  const getStatusIcon = (status) => {
    switch (String(status).toLowerCase()) {
      case 'backlog':
        return backlogIcon;
      case 'todo':
        return todoIcon;
      case 'in progress':
        return inProgressIcon;
      case 'done':
        return doneIcon;
      case 'cancelled':
        return cancelledIcon;
      default:
        return null;
    }
  };
  

  const formatGroupHeader = (groupBy, group) => {
    if (groupBy === 'priority') {
      return (
        <div className="group-header">
          <div className="header-left">
            <img 
              src={getPriorityIcon(group)} 
              alt="Priority Icon" 
              className="priority-icon"
            />
            <span>{formatPriorityLabel(group)}</span>
          </div>
          <div className="header-right-icons">
            <img src={add} alt="Icon 1" className="header-icon" />
            <img src={dot} alt="Icon 2" className="header-icon" />
          </div>
        </div>
      );
    } 
    else if (groupBy === 'status') {
      return (
        <div className="group-header">
          <div className="header-left">
            <img src={getStatusIcon(group)} alt={`${group} icon`} className="status-icon" />
            <span>{group}</span>
          </div>
          <div className="header-right-icons">
            <img src={add} alt="Icon 1" className="header-icon" />
            <img src={dot} alt="Icon 2" className="header-icon" />
          </div>
        </div>
      );
    }
    return (
      <div className="group-header">
        <div className="header-left">
          <span>{`${groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}: ${group}`}</span>
        </div>
        <div className="header-right-icons">
          <img src={add} alt="Icon 1" className="header-icon" />
          <img src={dot} alt="Icon 2" className="header-icon" />
        </div>
      </div>
    );
  };
  

  

  const handleGroupByChange = (option) => {
    setGroupBy(option);
    setDisplayOptions(false);
  };

  const handleSortByChange = (option) => {
    setSortBy(option);
    setDisplayOptions(false);
  };

  useEffect(() => {
    const getTasks = async () => {
      try {
        const tasksData = await fetchTickets();
        setTasks(tasksData);
        setLoading(false);
      } catch (err) {
        setError("Error fetching tasks");
        setLoading(false);
      }
    };
    getTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      const sortedTasks = [...tasks].sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1;
        if (a[sortBy] > b[sortBy]) return 1;
        return 0;
      });
      setTasks(sortedTasks);
    }
  }, [sortBy, tasks]);

  const groupedTasks = tasks.reduce((groups, task) => {
    const groupKey = task[groupBy];
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(task);
    return groups;
  }, {});

  const toggleTaskDetails = (taskId) => {
    setTaskDetailsVisible((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId], 
    }));
  };

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="kanban-board">
      <div className="display-button-container">
        <button className="display-button" onClick={toggleDisplayOptions}>
        <img src={displayIcon} alt="Display Icon" className="display-icon" />
          Display
        </button>

        {displayOptions && (
          <div className="display-options">
            <h4>Group by</h4>
            <button onClick={() => handleGroupByChange("priority")}>Priority</button>
            <button onClick={() => handleGroupByChange("status")}>Status</button>
            <button onClick={() => handleGroupByChange("user")}>User</button>

            <h4>Sort by</h4>
            <button onClick={() => handleSortByChange("priority")}>Priority</button>
            <button onClick={() => handleSortByChange("title")}>Title</button>
          </div>
        )}
      </div>

      <div className="tasks-container">
        {Object.keys(groupedTasks).map((group) => (
          <div key={group} className="task-group">
            <h3>{formatGroupHeader(groupBy, group)}</h3>
            <div className="task-list">
              {groupedTasks[group].map((task) => (
                <div key={task.id} className="task-card">
                  <h5>
                    {task.title}
                  </h5>
                  <button onClick={() => toggleTaskDetails(task.id)} className="feature-request-text">
                    Feature request
                  </button>
                  {taskDetailsVisible[task.id] && (
                    <div className="task-details">
                      <p>Priority: {formatPriorityLabel(task.priority)}</p>
                      <p>Status: {task.status}</p>
                      <p>User: {task.user}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
