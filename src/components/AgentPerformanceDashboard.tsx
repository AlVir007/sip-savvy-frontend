// Create src/components/AgentPerformanceDashboard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChartBarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  BoltIcon 
} from '@heroicons/react/24/outline';

interface AgentExecution {
  id: string;
  status: 'completed' | 'running' | 'failed';
  started_at: string;
  completed_at: string | null;
  duration_seconds: number | null;
}

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'error';
  success_rate: number;
  execution_count: number;
  last_execution: string | null;
  tasks_created_today: number;
  recent_executions: AgentExecution[];
}

interface AgentPerformanceDashboardProps {
  agents: Agent[];
}

export const AgentPerformanceDashboard: React.FC<AgentPerformanceDashboardProps> = ({
  agents
}) => {
  // Calculate overall metrics
  const totalExecutions = agents.reduce((sum, agent) => sum + agent.execution_count, 0);
  const averageSuccessRate = agents.length > 0 
    ? agents.reduce((sum, agent) => sum + agent.success_rate, 0) / agents.length 
    : 0;
  const activeAgents = agents.filter(agent => agent.status === 'active').length;
  const totalTasksToday = agents.reduce((sum, agent) => sum + agent.tasks_created_today, 0);

  // Get recent activity (last 24 hours)
  const recentExecutions = agents.flatMap(agent => 
    agent.recent_executions.map(execution => ({
      ...execution,
      agent_name: agent.name,
      agent_type: agent.type
    }))
  ).sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  const getAgentTypeIcon = (type: string) => {
    switch (type) {
      case 'story_discovery':
        return <BoltIcon className="h-4 w-4 text-blue-500" />;
      case 'persona_content':
        return <ChartBarIcon className="h-4 w-4 text-green-500" />;
      case 'editorial_planning':
        return <CheckCircleIcon className="h-4 w-4 text-purple-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getExecutionStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'running':
        return <ClockIcon className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <BoltIcon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAgents}</div>
            <p className="text-xs text-gray-500">of {agents.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <ChartBarIcon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageSuccessRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-500">average across all agents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <ClockIcon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExecutions}</div>
            <p className="text-xs text-gray-500">all time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Today</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasksToday}</div>
            <p className="text-xs text-gray-500">created by agents</p>
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Agent Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getAgentTypeIcon(agent.type)}
                    <div>
                      <div className="font-medium">{agent.name}</div>
                      <div className="text-sm text-gray-600 capitalize">
                        {agent.type.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusBadge(agent.status)}>
                      {agent.status}
                    </Badge>
                    <div className="text-right text-sm">
                      <div className="font-medium">{agent.success_rate}%</div>
                      <div className="text-gray-500">{agent.execution_count} runs</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentExecutions.slice(0, 10).map((execution) => (
                <div key={execution.id} className="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    {getExecutionStatusIcon(execution.status)}
                    <div>
                      <div className="font-medium text-sm">{execution.agent_name}</div>
                      <div className="text-xs text-gray-600 capitalize">
                        {execution.agent_type.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="text-gray-900">
                      {formatTimeAgo(execution.started_at)}
                    </div>
                    {execution.duration_seconds && (
                      <div className="text-gray-500">
                        {Math.abs(execution.duration_seconds).toFixed(1)}s
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {recentExecutions.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No recent activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Performing Agents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {agents
              .filter(agent => agent.execution_count > 0)
              .sort((a, b) => b.success_rate - a.success_rate)
              .slice(0, 3)
              .map((agent) => (
                <div key={agent.id} className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    {getAgentTypeIcon(agent.type)}
                  </div>
                  <div className="font-medium">{agent.name}</div>
                  <div className="text-2xl font-bold text-blue-600 mt-1">
                    {agent.success_rate}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {agent.execution_count} executions
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {agent.tasks_created_today} tasks today
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};