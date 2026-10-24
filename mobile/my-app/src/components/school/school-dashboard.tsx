import { useRef, useState } from 'react';
import type { ComponentRef } from 'react';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from './icons.json';
import data from './demo-data.json';

const blue = '#0050d5';
type IconName = keyof typeof icons;
function Icon({ name, color = blue, size = 22 }: { name: string; color?: string; size?: number }) {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="' + icons[name as IconName] + '"/></svg>';
  return <Image source={{ uri: 'data:image/svg+xml;utf8,' + encodeURIComponent(svg) }} style={{ width: size, height: size }} accessibilityElementsHidden />;
}
const ringSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><circle cx="90" cy="90" r="72" fill="none" stroke="#ebedef" stroke-width="14"/><circle cx="90" cy="90" r="72" fill="none" stroke="#064bcb" stroke-width="14" stroke-dasharray="47 66" transform="rotate(-108 90 90)"/></svg>';
const sections: Record<string, string[]> = data.sections;

export default function SchoolDashboard() {
  const [period, setPeriod] = useState<'monthly' | 'weekly'>('monthly');
  const [selected, setSelected] = useState(5);
  const [expanded, setExpanded] = useState(false);
  const [panel, setPanel] = useState<string | null>(null);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const scheduleY = useRef(0);
  const series = data[period];
  function open(name: string) {
    if (name === 'Students' || name === 'Tasks') { setPanel(null); router.push('./students'); return; }
    if (name === 'Timetable') {
      setPanel(null);
      setExpanded(true);
      scroll.current?.scrollTo({ y: scheduleY.current, animated: true });
    } else setPanel(name);
  }
  const menuOptions = panel === 'Menu' ? ['Students', 'Fee Mgt', 'Reports', 'Timetable', 'Profile'] : ['Students', 'Fee Mgt', 'Timetable'];
  return <SafeAreaView style={s.safe}>
    <View style={s.header}>
      <Pressable accessibilityRole="button" accessibilityLabel="Open menu" style={s.iconButton} onPress={() => open('Menu')}><Icon name="menu" /></Pressable>
      <Text accessibilityRole="header" style={s.headerTitle}>School Management</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Open administrator profile" style={s.avatar} onPress={() => open('Profile')}><Text style={s.avatarText}>SA</Text></Pressable>
    </View>
    <ScrollView ref={scroll} contentContainerStyle={s.content}>
      <View style={s.stats}>{data.stats.map((stat, index) => <View style={s.stat} key={stat.label}><Text style={s.statLabel}>{stat.label}</Text><View style={s.statValueRow}><Text style={[s.statValue, index === 2 && { color: '#d70719' }]}>{stat.value}</Text><Icon name={stat.icon} color={index === 2 ? '#d70719' : '#087c8d'} /></View></View>)}</View>
      <View style={s.actions}><Text style={s.actionsTitle}>QUICK ACTIONS</Text><View style={s.actionRow}>{data.actions.map((action, index) => <Pressable accessibilityRole="button" style={s.action} key={action.label} onPress={() => open(action.label)}><View style={[s.actionIcon, index === 0 && s.selectedAction]}><Icon name={action.icon} color={index === 0 ? 'white' : blue} /></View><Text style={s.actionLabel}>{action.label}</Text></Pressable>)}</View></View>
      <View style={s.panel}>
        <View style={s.panelHeading}><View><Text accessibilityRole="header" style={s.panelTitle}>Revenue Trend</Text><Text style={s.caption}>{period === 'monthly' ? 'Last 6 Months' : 'This Week'}</Text></View><Pressable accessibilityRole="button" accessibilityLabel={'Revenue period: ' + period + '. Change period'} style={s.period} onPress={() => setPanel('Revenue period')}><Text style={s.periodText}>{period === 'monthly' ? 'Monthly' : 'Weekly'}⌄</Text></Pressable></View>
        <View style={s.bars}>{series.values.map((value, index) => <Pressable key={series.labels[index]} accessibilityRole="button" accessibilityLabel={series.labels[index] + ': $' + value + 'K'} accessibilityState={{ selected: selected === index }} onPress={() => setSelected(index)} style={s.barColumn}><View style={[s.bar, { height: (value / Math.max(...series.values) * 86) + '%', backgroundColor: selected === index ? '#064bcb' : '#cdddf8' }]}>{selected === index && <View style={s.tooltip}><Text style={s.tooltipText}>{index === 5 ? 'Current' : series.labels[index]}:{'\n'}${value.toFixed(1)}K</Text></View>}</View><Text style={s.barLabel}>{series.labels[index]}</Text></Pressable>)}</View>
      </View>
      <View style={[s.panel, s.growth]}>
        <Text accessibilityRole="header" style={s.panelTitle}>Student Growth</Text><Text style={s.caption}>Active Enrolments</Text>
        <View style={s.ring} accessible accessibilityLabel="Student growth 12 percent. Target met. 24 new students and 96 returning."><Image source={{ uri: 'data:image/svg+xml;utf8,' + encodeURIComponent(ringSvg) }} style={StyleSheet.absoluteFill} /><View style={s.ringLabel}><Text style={s.growthValue}>+12%</Text><Text style={s.target}>Target met</Text></View></View>
        <View style={s.legendRow}><View style={s.legendLabel}><View style={s.dot} /><Text style={s.legendText}>New</Text></View><Text style={s.legendText}>24</Text></View>
        <View style={s.legendRow}><View style={s.legendLabel}><View style={[s.dot, { backgroundColor: '#ebedef' }]} /><Text style={s.legendText}>Returning</Text></View><Text style={s.legendText}>96</Text></View>
      </View>
      <View style={[s.panel, s.schedule]} onLayout={event => { scheduleY.current = event.nativeEvent.layout.y; }}>
        <View style={s.panelHeading}><Text accessibilityRole="header" style={s.panelTitle}>Today’s Schedule</Text><Pressable accessibilityRole="button" hitSlop={10} onPress={() => setExpanded(!expanded)}><Text style={s.link}>{expanded ? 'Show Less' : 'View All'}</Text></Pressable></View>
        <View style={s.lessons}>{data.schedule.slice(0, expanded ? 8 : 3).map(lesson => <View style={s.lesson} key={lesson.title}><View style={s.lessonIcon}><Icon name={lesson.icon} color="#007c91" /></View><View style={s.lessonInfo}><Text style={s.lessonTitle}>{lesson.title}</Text><Text style={s.lessonTime}>{lesson.time} • {lesson.room}</Text></View><Text style={[s.badge, lesson.status === 'Active' && s.activeBadge]}>{lesson.status}</Text></View>)}</View>
      </View>
      <Text style={s.sample}>Preview workspace · Sample data</Text>
    </ScrollView>
    <Pressable accessibilityRole="button" accessibilityLabel="Open quick add" style={s.add} onPress={() => open('Quick add')}><Icon name="plus" color="white" size={28} /></Pressable>
    <View style={s.nav}>{['Dashboard', 'Tasks', 'Alerts', 'Profile'].map(item => <Pressable accessibilityRole="button" accessibilityState={{ selected: item === 'Dashboard' }} key={item} style={[s.navButton, item === 'Dashboard' && s.activeNav]} onPress={() => item === 'Dashboard' ? scroll.current?.scrollTo({ y: 0, animated: true }) : open(item)}><Icon name={item.toLowerCase()} color={item === 'Dashboard' ? 'white' : '#51586a'} size={20} /><Text style={[s.navText, item === 'Dashboard' && { color: 'white' }]}>{item}</Text></Pressable>)}</View>
    <Modal visible={panel !== null} transparent animationType="fade" onRequestClose={() => setPanel(null)}>
      <View style={s.overlay}><View style={s.dialog} accessibilityViewIsModal>
        <View style={s.panelHeading}><Text accessibilityRole="header" style={s.panelTitle}>{panel}</Text><Pressable accessibilityRole="button" accessibilityLabel="Close dialog" style={s.iconButton} onPress={() => setPanel(null)}><Icon name="close" /></Pressable></View>
        <Text style={s.dialogNote}>School workspace · Sample data</Text>
        <ScrollView>
          {panel === 'Revenue period' ? (['monthly', 'weekly'] as const).map(option => <Pressable accessibilityRole="button" accessibilityState={{ selected: option === period }} key={option} style={s.menuItem} onPress={() => { setPeriod(option); setSelected(5); setPanel(null); }}><Text style={s.menuText}>{option === 'monthly' ? 'Monthly' : 'Weekly'}{option === period ? ' ✓' : ''}</Text></Pressable>)
            : panel === 'Menu' || panel === 'Quick add' ? <>{menuOptions.map(option => <Pressable accessibilityRole="button" key={option} style={s.menuItem} onPress={() => open(option)}><Text style={s.menuText}>{option}</Text><Text style={s.menuText}>→</Text></Pressable>)}{panel === 'Menu' && <Pressable accessibilityRole="button" style={s.menuItem} onPress={() => { setPanel(null); router.replace('/'); }}><Text style={s.menuText}>Back to login</Text></Pressable>}</>
            : <>{(sections[panel || ''] || []).map(line => <Text key={line} style={s.detailLine}>• {line}</Text>)}<Text style={s.dialogNote}>This is a dashboard preview. Detailed records and changes will be available when this module is connected.</Text></>}
        </ScrollView>
      </View></View>
    </Modal>
  </SafeAreaView>;
}
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f6f8fa' },
  header: { height: 62, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 8, borderBottomWidth: 1, borderColor: '#e4e7ee' },
  iconButton: { minWidth: 36, minHeight: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '600', color: blue, flex: 1 },
  avatar: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: '#d4e0e7', backgroundColor: '#194b60', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: 'white', fontSize: 11, fontWeight: '600' },
  content: { padding: 16, paddingTop: 22, paddingBottom: 30, maxWidth: 640, width: '100%', alignSelf: 'center' },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  stat: { width: '46%', flexGrow: 1, backgroundColor: 'white', borderWidth: 1, borderColor: '#cdd2e3', borderRadius: 10, padding: 16, boxShadow: '0 2px 4px #142f5010' },
  statLabel: { fontSize: 11, letterSpacing: 0.6, color: '#343b50', marginBottom: 8 },
  statValueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 },
  statValue: { fontSize: 32, fontWeight: '600', color: blue },
  actions: { marginTop: 26, marginBottom: 38 },
  actionsTitle: { fontSize: 12, letterSpacing: 1.3, color: '#313749', marginBottom: 18 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  action: { alignItems: 'center', gap: 10, minWidth: 66 },
  actionIcon: { width: 58, height: 58, backgroundColor: '#e0e4e9', borderWidth: 1, borderColor: '#ccd1de', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  selectedAction: { backgroundColor: '#2864ed', borderColor: '#2864ed' },
  actionLabel: { fontSize: 12, color: '#1a1d25' },
  panel: { backgroundColor: 'white', borderWidth: 1, borderColor: '#cdd2e3', borderRadius: 11, paddingHorizontal: 16, paddingVertical: 18, boxShadow: '0 2px 4px #142f5010' },
  panelHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  panelTitle: { fontSize: 20, fontWeight: '500', color: '#171b22', letterSpacing: -0.5 },
  caption: { fontSize: 11, color: '#353b50', marginTop: 2 },
  period: { borderWidth: 1, borderColor: '#d4d9e6', borderRadius: 7, paddingHorizontal: 8, minHeight: 34, justifyContent: 'center', backgroundColor: '#f7f8fb' },
  periodText: { fontSize: 12, color: '#1e2431' },
  bars: { height: 290, flexDirection: 'row', gap: 8, marginTop: 14 },
  barColumn: { flex: 1, justifyContent: 'flex-end' },
  bar: { borderTopLeftRadius: 2, borderTopRightRadius: 2 },
  barLabel: { fontSize: 10, color: '#717b8d', marginTop: 6 },
  tooltip: { position: 'absolute', bottom: '100%', right: 0, minWidth: 52, backgroundColor: '#2d3237', padding: 7, borderRadius: 4 },
  tooltipText: { color: 'white', fontSize: 10, lineHeight: 14 },
  growth: { marginTop: 24 },
  ring: { width: 180, height: 180, alignSelf: 'center', marginVertical: 32 },
  ringLabel: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  growthValue: { fontSize: 24, fontWeight: '600', color: blue },
  target: { fontSize: 12, color: '#3d4351' },
  legendRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  legendLabel: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: blue },
  legendText: { fontSize: 14, color: '#171b22' },
  schedule: { marginTop: 112 },
  link: { color: blue, fontSize: 12 },
  lessons: { marginTop: 16 },
  lesson: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 16, borderTopWidth: 1, borderColor: '#e0e4eb' },
  lessonIcon: { width: 40, height: 40, backgroundColor: '#e5f2f5', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  lessonInfo: { flex: 1 },
  lessonTitle: { fontSize: 14, fontWeight: '500', color: '#171b22', marginBottom: 5 },
  lessonTime: { fontSize: 10, color: '#4b5165', lineHeight: 14 },
  badge: { fontSize: 10, color: '#64707c', backgroundColor: '#e5e7e9', borderRadius: 12, paddingVertical: 5, paddingHorizontal: 9, overflow: 'hidden' },
  activeBadge: { backgroundColor: '#e6eeff', color: blue },
  sample: { color: '#69758a', fontSize: 11, textAlign: 'center', marginTop: 20 },
  nav: { flexDirection: 'row', justifyContent: 'space-between', gap: 6, paddingHorizontal: 16, paddingVertical: 7, height: 64, borderTopWidth: 1, borderColor: '#e0e4eb', backgroundColor: '#f9fafc' },
  navButton: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 24, gap: 3 },
  activeNav: { backgroundColor: '#2864ed' },
  navText: { color: '#51586a', fontSize: 11 },
  add: { position: 'absolute', right: 22, bottom: 110, width: 58, height: 58, borderRadius: 16, backgroundColor: '#064bcb', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 14px #064bcb55' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#12213a66' },
  dialog: { width: '100%', maxWidth: 440, maxHeight: '85%', backgroundColor: 'white', borderRadius: 16, padding: 24 },
  dialogNote: { fontSize: 13, lineHeight: 21, color: '#68758b', marginVertical: 14 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 14, borderWidth: 1, borderColor: '#dce2ed', borderRadius: 8, backgroundColor: '#f8faff', marginBottom: 8 },
  menuText: { color: blue, fontSize: 16 },
  detailLine: { fontSize: 15, lineHeight: 28, color: '#171b22' },
});
