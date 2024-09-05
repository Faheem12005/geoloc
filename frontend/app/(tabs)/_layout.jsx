const TabLayout = () => {
  const isOfficer = useSelector((state) => state.worker.isOfficer);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 84,
          },
        }}
        initialRouteName={isOfficer ? 'home-officer' : 'home-worker'}
      >
        {isOfficer && (
          <>
            <Tabs.Screen
              name="records"
              options={{
                title: 'Records',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon
                    icon={icons.bookmark}
                    color={color}
                    name="records"
                    focused={focused}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="home-officer"
              options={{
                title: 'Home-officer',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon
                    icon={icons.home}
                    color={color}
                    name="home"
                    focused={focused}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="track"
              options={{
                title: 'Track',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon
                    icon={icons.profile}
                    color={color}
                    name="track"
                    focused={focused}
                  />
                ),
              }}
            />
          </>
        )}
        {!isOfficer && (
          <>
            <Tabs.Screen
              name="home-worker"
              options={{
                title: 'Home-worker',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon
                    icon={icons.home}
                    color={color}
                    name="home"
                    focused={focused}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="create"
              options={{
                title: 'Create',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon
                    icon={icons.plus}
                    color={color}
                    name="create"
                    focused={focused}
                  />
                ),
              }}
            />
          </>
        )}
      </Tabs>
    </>
  );
};

export default TabLayout;
