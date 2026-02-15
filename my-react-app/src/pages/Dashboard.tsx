import React, { useEffect } from 'react';
import { Layout, Row, Col, Card, Statistic } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  ProjectOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../stores/useAuthStore';
import Button from '../components/common/Button';

const { Header, Content, Footer } = Layout;

const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Initialize dashboard
    console.log('Dashboard mounted');
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', color: 'white', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ color: 'white', margin: 0 }}>Business Efficiency Platform</h1>
          <div>{isAuthenticated && user?.name && <span>{user.name}</span>}</div>
        </div>
      </Header>
      <Content style={{ padding: '24px' }}>
        <main>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={1234}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Active Teams"
                  value={56}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Projects"
                  value={189}
                  prefix={<ProjectOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Documents"
                  value={5321}
                  prefix={<FileOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
            <Col xs={24}>
              <Card title="Quick Actions">
                <Button variant="primary" size="large">
                  Create New Project
                </Button>
                <Button style={{ marginLeft: '8px' }} variant="secondary" size="large">
                  View Reports
                </Button>
              </Card>
            </Col>
          </Row>
        </main>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Business Efficiency Platform ©2024 Created by Your Team
      </Footer>
    </Layout>
  );
};

export default Dashboard;
