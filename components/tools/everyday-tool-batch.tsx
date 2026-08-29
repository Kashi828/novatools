'use client';
import { useMemo, useState, useEffect } from 'react';
import { ToolShell } from '@/components/tool-shell';
import { Button } from '@/components/ui/button';
const field = 'w-full rounded-xl border border-black/10 bg-white/60 p-3 text-sm outline-none focus:border-primary-400 dark:border-white/10 dark:bg-white/5';

export function SplitBillCalculator() {
  const [amount,setAmount]=useState('1000'),[people,setPeople]=useState('2'),[tip,setTip]=useState('10');
  const result=useMemo(()=>{const a=Number(amount),p=Math.max(1,Number(people)||1),t=Number(tip)||0;if(!Number.isFinite(a)||a<0)return null;const total=a*(1+t/100);return {total,share:total/p,tip:a*t/100};},[amount,people,tip]);
  return <ToolShell outputValue={result?'Total '+result.total.toFixed(2)+'; each '+result.share.toFixed(2):undefined} onReset={()=>{setAmount('');setPeople('2');setTip('0')}} shareSlug="split-bill-calculator"><div className="grid gap-3 sm:grid-cols-3"><label className="text-sm font-medium">Bill amount<input type="number" value={amount} onChange={e=>setAmount(e.target.value)} className={field}/></label><label className="text-sm font-medium">People<input type="number" min="1" value={people} onChange={e=>setPeople(e.target.value)} className={field}/></label><label className="text-sm font-medium">Tip %<input type="number" min="0" value={tip} onChange={e=>setTip(e.target.value)} className={field}/></label></div>{result&&<div className="grid grid-cols-3 gap-3">{[['Total',result.total],['Tip',result.tip],['Each person',result.share]].map(([label,value])=><div key={String(label)} className="rounded-xl bg-black/[.02] p-4 text-center dark:bg-white/5"><div className="font-heading text-xl font-bold">{Number(value).toFixed(2)}</div><div className="text-xs text-black/50 dark:text-white/50">{String(label)}</div></div>)}</div>}</ToolShell>;
}

export function FuelCostCalculator() {
  const [distance,setDistance]=useState('100'),[efficiency,setEfficiency]=useState('15'),[price,setPrice]=useState('100');
  const result=useMemo(()=>{const d=Number(distance),e=Number(efficiency),p=Number(price);return d>=0&&e>0&&p>=0?{litres:d/e,cost:d/e*p}:null;},[distance,efficiency,price]);
  return <ToolShell outputValue={result?'Fuel: '+result.litres.toFixed(2)+' L; cost: '+result.cost.toFixed(2):undefined} onReset={()=>{setDistance('');setEfficiency('');setPrice('')}} shareSlug="fuel-cost-calculator"><div className="grid gap-3 sm:grid-cols-3"><label className="text-sm font-medium">Distance (km)<input type="number" value={distance} onChange={e=>setDistance(e.target.value)} className={field}/></label><label className="text-sm font-medium">Mileage (km/L)<input type="number" value={efficiency} onChange={e=>setEfficiency(e.target.value)} className={field}/></label><label className="text-sm font-medium">Fuel price / L<input type="number" value={price} onChange={e=>setPrice(e.target.value)} className={field}/></label></div>{result&&<div className="rounded-xl2 bg-gradient-brand p-6 text-center text-white"><div className="font-heading text-3xl font-bold">{result.cost.toFixed(2)}</div><p className="mt-1 text-sm text-white/80">Estimated trip cost · {result.litres.toFixed(2)} litres</p></div>}</ToolShell>;
}

export function RecipeScaler() {
  const [servings,setServings]=useState('4'),[target,setTarget]=useState('6'),[ingredients,setIngredients]=useState('Flour, 250 g\nMilk, 500 ml\nEggs, 2');
  const factor=(Number(target)||0)/(Number(servings)||1);
  const output=useMemo(()=>ingredients.split(/\r?\n/).filter(Boolean).map((line)=>{const match=line.match(/^(.*?,\s*)(\d+(?:\.\d+)?)(.*)$/);return match?match[1]+(Number(match[2])*factor).toFixed(2).replace(/\.00$/,'')+match[3]:line;}).join('\n'),[ingredients,factor]);
  return <ToolShell outputValue={output} onReset={()=>setIngredients('')} shareSlug="recipe-scaler"><div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-medium">Recipe servings<input type="number" min="1" value={servings} onChange={e=>setServings(e.target.value)} className={field}/></label><label className="text-sm font-medium">Target servings<input type="number" min="1" value={target} onChange={e=>setTarget(e.target.value)} className={field}/></label></div><p className="text-sm text-black/50 dark:text-white/50">Enter ingredients as “name, amount unit”.</p><div className="grid gap-3 sm:grid-cols-2"><textarea value={ingredients} onChange={e=>setIngredients(e.target.value)} rows={8} className={field}/><textarea value={output} readOnly rows={8} className={field}/></div></ToolShell>;
}

export function SavingsGoalCalculator() {
  const [goal,setGoal]=useState('100000'),[saved,setSaved]=useState('20000'),[monthly,setMonthly]=useState('5000');
  const result=useMemo(()=>{const g=Number(goal),s=Number(saved),m=Number(monthly);return g>=s&&m>0?Math.ceil((g-s)/m):null;},[goal,saved,monthly]);
  return <ToolShell outputValue={result===null?undefined:String(result)+' months'} onReset={()=>{setGoal('');setSaved('0');setMonthly('')}} shareSlug="savings-goal-calculator"><div className="grid gap-3 sm:grid-cols-3"><label className="text-sm font-medium">Goal amount<input type="number" value={goal} onChange={e=>setGoal(e.target.value)} className={field}/></label><label className="text-sm font-medium">Already saved<input type="number" value={saved} onChange={e=>setSaved(e.target.value)} className={field}/></label><label className="text-sm font-medium">Save each month<input type="number" value={monthly} onChange={e=>setMonthly(e.target.value)} className={field}/></label></div><div className="rounded-xl2 bg-black/[.02] p-6 text-center dark:bg-white/5">{result===null?<p className="text-sm text-danger">Enter a monthly saving amount and a goal above your saved amount.</p>:<><div className="font-heading text-4xl font-bold text-primary-500">{result} months</div><p className="mt-1 text-sm text-black/50 dark:text-white/50">to reach your goal at this pace</p></>}</div></ToolShell>;
}

const GROCERIES='novatools-groceries';
export function GroceryList() {
  const [item,setItem]=useState(''),[items,setItems]=useState<{name:string;done:boolean}[]>([]);
  useEffect(()=>{try{setItems(JSON.parse(localStorage.getItem(GROCERIES)||'[]'))}catch{}},[]);
  useEffect(()=>{localStorage.setItem(GROCERIES,JSON.stringify(items))},[items]);
  function add(){const name=item.trim();if(name){setItems([...items,{name,done:false}]);setItem('')}}
  return <ToolShell outputValue={items.map(x=>(x.done?'✓':'○')+' '+x.name).join('\n')} onReset={()=>setItems([])} shareSlug="grocery-list"><div className="flex gap-2"><input value={item} onChange={e=>setItem(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')add()}} placeholder="Add a grocery item..." className={field}/><Button onClick={add}>Add</Button></div><div className="space-y-2">{items.length?items.map((entry,index)=><div key={index} className="flex items-center gap-3 rounded-xl border border-black/10 p-3 dark:border-white/10"><input type="checkbox" checked={entry.done} onChange={()=>setItems(items.map((x,i)=>i===index?{...x,done:!x.done}:x)} className="accent-primary-500"/><span className={entry.done?'flex-1 line-through text-black/40 dark:text-white/40':'flex-1'}>{entry.name}</span><button onClick={()=>setItems(items.filter((_,i)=>i!==index))} className="text-xs text-danger">Remove</button></div>):<p className="py-6 text-center text-sm text-black/45 dark:text-white/45">Your list is saved only in this browser.</p>}</div></ToolShell>;
}

export function TravelBudgetCalculator() {
  const [days,setDays]=useState('5'),[stay,setStay]=useState('3000'),[food,setFood]=useState('1200'),[travel,setTravel]=useState('5000'),[other,setOther]=useState('2000');
  const total=useMemo(()=>{const d=Number(days);return d>0?d*((Number(stay)||0)+(Number(food)||0))+(Number(travel)||0)+(Number(other)||0):0},[days,stay,food,travel,other]);
  return <ToolShell outputValue={'Estimated trip budget: '+total.toFixed(2)} onReset={()=>{setDays('');setStay('');setFood('');setTravel('');setOther('')}} shareSlug="travel-budget-calculator"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{[['Days',days,setDays],['Stay per day',stay,setStay],['Food per day',food,setFood],['Transport total',travel,setTravel],['Other total',other,setOther]].map(([label,value,setter])=><label key={String(label)} className="text-sm font-medium">{String(label)}<input type="number" value={value as string} onChange={e=>(setter as (value:string)=>void)(e.target.value)} className={field}/></label>)}</div><div className="rounded-xl2 bg-gradient-brand p-6 text-center text-white"><div className="font-heading text-3xl font-bold">{total.toFixed(2)}</div><p className="mt-1 text-sm text-white/80">Estimated total travel budget</p></div></ToolShell>;
}

export function PetAgeCalculator() {
  const [years,setYears]=useState('3'),[type,setType]=useState<'dog'|'cat'>('dog');
  const age=useMemo(()=>{const y=Math.max(0,Number(years)||0);if(type==='cat')return y===0?0:y===1?15:y===2?24:24+(y-2)*4;return y===0?0:y===1?15:y===2?24:24+(y-2)*5;},[years,type]);
  return <ToolShell outputValue={age+' estimated human years'} onReset={()=>setYears('')} shareSlug="pet-age-calculator"><div className="flex gap-2"><Button variant={type==='dog'?'primary':'outline'} onClick={()=>setType('dog')}>Dog</Button><Button variant={type==='cat'?'primary':'outline'} onClick={()=>setType('cat')}>Cat</Button></div><label className="block max-w-xs text-sm font-medium">Pet age in years<input type="number" min="0" step=".1" value={years} onChange={e=>setYears(e.target.value)} className={field}/></label><div className="rounded-xl2 bg-black/[.02] p-7 text-center dark:bg-white/5"><div className="font-heading text-4xl font-bold">{age.toFixed(1)}</div><p className="mt-1 text-sm text-black/50 dark:text-white/50">estimated human years · a general guide, not veterinary advice</p></div></ToolShell>;
}
