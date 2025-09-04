import React, { useState, useEffect } from 'react';
import { AgentsDraggableGrid } from '@/components/AgentsDraggableGrid.tsx';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  PlayIcon, 
  PauseIcon, 
  CogIcon, 
  ChartBarIcon,
  BoltIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const AgentsTab = ({ user }) => {
  const [agents, setAgents] = useState([]);
  const [agentExecutions, setAgentExecutions] = useState({});
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState({});

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  // Get auth token from your existing auth context
  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      console.log('Fetching agents from:', `${API_URL}/agents`);
      
      const response = await fetch(`${API_URL}/agents`, {
        headers: getAuthHeaders()
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const agentsData = await response.json();
        console.log('Agents response data:', agentsData);
        
        // Handle different response formats
        let agentsArray = [];
        if (Array.isArray(agentsData)) {
          agentsArray = agentsData;
        } else if (agentsData.data && Array.isArray(agentsData.data)) {
          agentsArray = agentsData.data;
        } else if (agentsData.agents && Array.isArray(agentsData.agents)) {
          agentsArray = agentsData.agents;
        } else {
          console.error('Unexpected agents data format:', agentsData);
          toast.error('Unexpected data format from agents endpoint');
          return;
        }
        
        setAgents(agentsArray);
        
        // Fetch execution history for each agent
        const executionsData = {};
        for (const agent of agentsArray) {
          try {
            const execResponse = await fetch(`${API_URL}/agents/${agent.id}/executions`, {
              headers: getAuthHeaders()
            });
            if (execResponse.ok) {
              const execData = await execResponse.json();
              executionsData[agent.id] = Array.isArray(execData) ? execData : (execData.data || []);
            }
          } catch (error) {
            console.error(`Failed to fetch executions for agent ${agent.id}:`, error);
          }
        }
        setAgentExecutions(executionsData);
      } else {
        const errorText = await response.text();
        console.error('Failed to load agents. Status:', response.status, 'Response:', errorText);
        toast.error(`Failed to load agents: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Error connecting to agent system');
    } finally {
      setLoading(false);
    }
  };

  const executeAgent = async (agentId) => {
    try {
      setExecuting(prev => ({ ...prev, [agentId]: true }));
      
      const response = await fetch(`${API_URL}/agents/${agentId}/execute`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const result = await response.json();
        toast.success(`Agent executed successfully: ${result.message || 'Task completed'}`);
        
        // Refresh agents and executions
        await fetchAgents();
      } else {
        const error = await response.json();
        toast.error(`Agent execution failed: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Agent execution error:', error);
      toast.error('Failed to execute agent');
    } finally {
      setExecuting(prev => ({ ...prev, [agentId]: false }));
    }
  };

  const updateAgentStatus = async (agentId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/agents/${agentId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        toast.success(`Agent ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
        await fetchAgents();
      } else {
        toast.error('Failed to update agent status');
      }
    } catch (error) {
      console.error('Error updating agent status:', error);
      toast.error('Error updating agent status');
    }
  };

  const getAgentTypeIcon = (type) => {
    switch (type) {
      case 'story_discovery':
        return <BoltIcon className="h-5 w-5 text-blue-600" />;
      case 'content_generation':
        return <ChartBarIcon className="h-5 w-5 text-green-600" />;
      case 'social_media':
        return <CogIcon className="h-5 w-5 text-purple-600" />;
      default:
        return <CogIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLastExecutionTime = (agentId) => {
    const executions = agentExecutions[agentId];
    if (!executions || executions.length === 0) return 'Never';
    
    const lastExecution = executions[0];
    const date = new Date(lastExecution.created_at);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getSuccessRate = (agentId) => {
    const executions = agentExecutions[agentId];
    if (!executions || executions.length === 0) return 0;
    
    const successful = executions.filter(e => e.status === 'completed').length;
    return Math.round((successful / executions.length) * 100);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading AI agents...</div>
      </div>
    );
  }

  // Ensure agents is always an array
  const agentsArray = Array.isArray(agents) ? agents : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Agents</h2>
          <p className="text-gray-600">Autonomous systems managing your editorial workflow</p>
        </div>
        <Button onClick={fetchAgents} variant="outline">
          Refresh Status
        </Button>
      </div>

      {/* Agent Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <CogIcon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentsArray.length}</div>
            <p className="text-xs text-gray-500">AI systems deployed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <PlayIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agentsArray.filter(a => a.status === 'active').length}
            </div>
            <p className="text-xs text-gray-500">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <BoltIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(agentExecutions).reduce((total, executions) => 
                total + (executions?.length || 0), 0
              )}
            </div>
            <p className="text-xs text-gray-500">All-time runs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
            <ChartBarIcon className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agentsArray.length > 0 
                ? Math.round(agentsArray.reduce((sum, agent) => sum + getSuccessRate(agent.id), 0) / agentsArray.length)
                : 0
              }%
            </div>
            <p className="text-xs text-gray-500">Success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Debug Information */}
      <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
        <strong>Debug Info:</strong>
        <div>API URL: {API_URL}/agents</div>
        <div>Agents loaded: {agentsArray.length}</div>
        <div>Auth token present: {!!localStorage.getItem('auth_token')}</div>
      </div>

      {/* Agents Grid */}
      <AgentsDraggableGrid
        agents={agentsArray}
        executing={executing}
        onExecuteAgent={executeAgent}
        onUpdateAgentStatus={updateAgentStatus}
        getLastExecutionTime={getLastExecutionTime}
        getSuccessRate={getSuccessRate}
        agentExecutions={agentExecutions}
        onReorder={(newOrder) => {
          console.log('New agent order:', newOrder.map(a => a.name || a.id));
        }}
      />

      {agentsArray.length === 0 && (
        <div className="text-center py-12">
          <CogIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No agents found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Check your backend configuration or create new agents.
          </p>
          <Button className="mt-4" onClick={fetchAgents}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default AgentsTab;