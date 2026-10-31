import { Text } from '@/components/responsive-text';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { barberFeatures, gymFeatures, useWorkspace } from './workspace-store';

type Module = 'School' | 'Gym' | 'Barber';
type Item = { label: string; detail: string; icon: keyof typeof Ionicons.glyphMap; route: Href };
export default function WorkspaceMenu({ initialModule = 'School', onClose }: { initialModule?: Module; onClose: () => void }) {
  const workspace = useWorkspace();
  const [selected,setSelected] = useState<Module>(initialModule);
  const modules: Module[] = ['School', ...(workspace.gym ? ['Gym' as const] : []), ...(workspace.barber ? ['Barber' as const] : [])];
  const moduleIcons = { School: 'school-outline', Gym: 'barbell-outline', Barber: 'cut-outline' } as const;
  const gymIcons = { members:'people-outline', renewal:'refresh-outline', training:'barbell-outline', reports:'bar-chart-outline' } as const;
  const barberIcons = { clients:'people-outline', payments:'card-outline', appointments:'calendar-outline', reports:'bar-chart-outline' } as const;
  const items: Item[] = selected === 'School' ? [
    {label:'Overview',detail:'Your school at a glance',icon:'grid-outline',route:'/school-dashboard'},
    {label:'Students / Tasks',detail:'Student records and profiles',icon:'people-outline',route:'/students'},
    {label:'Fee Management',detail:'Student fees and balances',icon:'wallet-outline',route:'/fee-management'},
    {label:'Timetable',detail:'Teachers and class schedules',icon:'calendar-outline',route:'/teacher-timetable'},
    {label:'Reports',detail:'School performance and insights',icon:'bar-chart-outline',route:'/reports'},
    {label:'Alerts',detail:'Invoices, appointments and reminders',icon:'notifications-outline',route:'/alerts'},
    {label:'Profile',detail:'Choose a student to view their profile',icon:'person-outline',route:'/profile'},
  ] : selected === 'Gym' ? [
    {label:'Overview',detail:'Your gym at a glance',icon:'grid-outline',route:'/gym-dashboard'},
    ...gymFeatures.filter(item=>workspace.features.includes(item.id)).map(item=>({label:item.label,detail:({members:'Members and their profiles',renewal:'Membership plans and renewals',training:'Members, trainers and sessions',reports:'Revenue and membership insights'})[item.id],icon:gymIcons[item.id],route:item.route})),
  ] : [
    {label:'Overview',detail:'Your barber services at a glance',icon:'grid-outline',route:{pathname:'/barber/[screen]',params:{screen:'dashboard'}}},
    ...barberFeatures.filter(item=>workspace.barberFeatures.includes(item.id)).map(item=>({label:item.label,detail:({clients:'Client profiles and preferences',payments:'Services, payments and loyalty',appointments:'Calendar and available slots',reports:'Revenue and service insights'})[item.id],icon:barberIcons[item.id],route:{pathname:'/barber/[screen]' as const,params:{screen:item.id}}})),
  ];
  if (selected !== 'School') items.push({label:'Alerts',detail:selected==='Gym'?'Training and membership reminders':'Barber appointment reminders',icon:'notifications-outline',route:{pathname:'/alerts',params:{module:selected.toLowerCase()}}});
  function navigate(route: Href) { onClose(); router.push(route); }
  return <Modal transparent animationType="fade" onRequestClose={onClose} visible><View style={s.overlay}>
    <Pressable style={StyleSheet.absoluteFill} accessibilityRole="button" accessibilityLabel="Close navigation" onPress={onClose}/>
    <SafeAreaView style={s.drawer} accessibilityViewIsModal>
      <View style={s.header}><View style={s.brandIcon}><Ionicons name="school-outline" color="white" size={23}/></View><View style={s.flex}><Text style={s.brand}>Smart CRM</Text><Text style={s.caption}>WORKSPACE NAVIGATION</Text></View><Pressable style={s.close} accessibilityRole="button" accessibilityLabel="Close menu" onPress={onClose}><Ionicons name="close" size={24} color="#5f6c81"/></Pressable></View>
      <View style={s.workspace}><View style={s.workspaceIcon}><Ionicons name="business-outline" size={20} color="#0755d7"/></View><View style={s.flex}><Text numberOfLines={2} style={s.workspaceName}>{workspace.name}</Text><Text style={s.subtitle}>School workspace</Text></View><View style={s.dot}/></View>
      <Text style={s.label}>SWITCH MODULE</Text><View style={s.tabs}>{modules.map(module=><Pressable key={module} accessibilityRole="tab" accessibilityState={{selected:selected===module}} onPress={()=>setSelected(module)} style={[s.tab,selected===module&&s.tabActive]}><Ionicons name={moduleIcons[module]} size={20} color={selected===module?'#0755d7':'#77869b'}/><Text style={[s.tabText,selected===module&&s.blue]}>{module}</Text></Pressable>)}</View>
      <ScrollView style={s.scroll} contentContainerStyle={s.links} showsVerticalScrollIndicator><View style={s.section}><Text style={s.sectionTitle}>{selected} module</Text><Text style={s.subtitle}>{items.length} destinations</Text></View>{items.map(item=>{const active=selected==='School'&&item.label==='Overview';return <Pressable key={item.label} accessibilityRole="link" accessibilityState={{selected:active}} onPress={()=>navigate(item.route)} style={({pressed})=>[s.item,active&&s.itemActive,pressed&&{opacity:.65}]}><View style={[s.itemIcon,active&&s.iconActive]}><Ionicons name={item.icon} size={22} color={active?'#0755d7':'#62758f'}/></View><View style={s.flex}><Text style={[s.itemTitle,active&&s.blue]}>{item.label}</Text><Text style={s.itemDetail}>{item.detail}</Text></View><Ionicons name="chevron-forward" size={16} color={active?'#0755d7':'#9aa7b9'}/></Pressable>;})}</ScrollView>
      <View style={s.footer}><View style={s.adminAvatar}><Text style={s.adminInitials}>SA</Text></View><View style={s.flex}><Text style={s.workspaceName}>School Admin</Text><Text style={s.subtitle}>Demo session</Text></View><Pressable accessibilityRole="link" accessibilityLabel="Back to workspaces" style={s.close} onPress={()=>{onClose();router.replace('/');}}><Ionicons name="exit-outline" size={22} color="#62758f"/></Pressable></View>
    </SafeAreaView>
  </View></Modal>;
}
const s=StyleSheet.create({overlay:{flex:1,backgroundColor:'#14243d70'},drawer:{height:'100%',width:'90%',maxWidth:420,backgroundColor:'white',borderTopRightRadius:22,borderBottomRightRadius:22},header:{padding:20,flexDirection:'row',alignItems:'center',gap:11},flex:{flex:1},brandIcon:{width:42,height:42,borderRadius:13,backgroundColor:'#0755d7',alignItems:'center',justifyContent:'center'},brand:{fontSize:22,fontWeight:'700',color:'#1e304c'},caption:{fontSize:8,letterSpacing:1.2,color:'#8a98ac',marginTop:4},close:{width:42,height:42,alignItems:'center',justifyContent:'center'},workspace:{marginHorizontal:20,padding:14,backgroundColor:'#f5f8fd',borderRadius:12,borderWidth:1,borderColor:'#e6edf6',flexDirection:'row',alignItems:'center',gap:10},workspaceIcon:{padding:9,borderRadius:10,backgroundColor:'#e4edfc'},workspaceName:{fontSize:14,fontWeight:'600',color:'#35465e'},subtitle:{fontSize:11,color:'#8592a5',marginTop:4},dot:{width:7,height:7,backgroundColor:'#3ca888',borderRadius:4},label:{marginHorizontal:22,marginTop:24,marginBottom:12,fontSize:9,fontWeight:'600',letterSpacing:1.5,color:'#8c99ad'},tabs:{marginHorizontal:20,padding:4,gap:4,backgroundColor:'#f1f4f9',borderRadius:12,flexDirection:'row'},tab:{flex:1,paddingVertical:11,alignItems:'center',gap:6,borderRadius:9},tabActive:{backgroundColor:'white',boxShadow:'0 2px 5px #16366512'},tabText:{fontSize:12,fontWeight:'600',color:'#77869b'},blue:{color:'#0755d7'},scroll:{flex:1,minHeight:0},links:{padding:14,paddingBottom:26},section:{paddingHorizontal:8,marginTop:8,marginBottom:16,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},sectionTitle:{fontSize:12,fontWeight:'600',color:'#697b95'},item:{flexDirection:'row',alignItems:'center',gap:11,paddingVertical:14,paddingHorizontal:10,borderRadius:12,marginBottom:5},itemActive:{backgroundColor:'#edf4ff'},itemIcon:{width:41,height:41,backgroundColor:'#f5f7fa',borderRadius:11,alignItems:'center',justifyContent:'center'},iconActive:{backgroundColor:'#dfebff'},itemTitle:{fontSize:14,fontWeight:'600',color:'#3c4e68'},itemDetail:{fontSize:10,lineHeight:16,color:'#8996a9',marginTop:3},footer:{borderTopWidth:1,borderColor:'#edf0f5',marginHorizontal:20,paddingVertical:16,flexDirection:'row',alignItems:'center',gap:10},adminAvatar:{width:38,height:38,borderRadius:19,backgroundColor:'#e7f0f4',alignItems:'center',justifyContent:'center'},adminInitials:{fontSize:12,fontWeight:'700',color:'#296179'}});
