

//                                                             <CommandGroup>
//                                                                 {
//                                                                     categories[
//                                                                         Number(
//                                                                             categories.findIndex((category) => (
//                                                                                 category.mainCategory === queryData.main_category
//                                                                             ))
//                                                                         )
//                                                                         ].subCategory
//                                                                         .map((data, index) => (
//                                                                         <CommandItem
//                                                                             disabled
//                                                                             key={index}
//                                                                             value={data.subName}
//                                                                             onSelect={(currentValue) => {
//                                                                                 //setModelValue(currentValue === mobilePostData.brand ? "" : currentValue)
//                                                                                 setQueryData({...queryData, sub_category: currentValue === queryData.sub_category ? "" : currentValue })
//                                                                                 setSubOpen(false)
//                                                                             }}
//                                                                         >
//                                                                             {  myAds?.counts?.sub?.length || 0 > 0 ?
//                                                                                 myAds?.counts.sub.map((sub, index)=>(
//                                                                                   <span key={index}>
//                                                                                     { (data.subName.replace(/\s/g, '').toLowerCase() === sub.sub_category )
//                                                                                       ? (<>{data.subName}<span className='text-gray-500 text-xs'>{" ⋆ "+sub.total +" ads"}</span></>)
//                                                                                       : (<span className='bg-blue-400'>{data.subName}<span className='text-gray-500 text-xs'>{" ⋆ "+0+" ads"}</span></span>)
//                                                                                      }
//                                                                                     </span>
//                                                                                 ))   
//                                                                                 : (<span className='pointer-events-none'>{data.subName}<span className='text-gray-500 text-xs'>{" ⋆ "+0+" ads"}</span></span>)
                                                                              
//                                                                             }
//                                                                             <Check
//                                                                                 className={cn(
//                                                                                     "ml-auto",
//                                                                                     queryData.sub_category === data.subName ? "opacity-100" : "opacity-0"
//                                                                                 )}
//                                                                             />
//                                                                         </CommandItem>
//                                                                     ))
//                                                                 }
//                                                             </CommandGroup>














//                                                                              { myAds?.counts?.sub?.length || 0 > 0 ?
//                                                                                 myAds?.counts.sub.map((sub, index)=>(
//                                                                                   <span key={index}>
//                                                                                     { (data.subName.replace(/\s/g, '').toLowerCase() === sub.sub_category )
//                                                                                       ? (<>{data.subName}<span className='text-gray-500 text-xs'>{" ⋆ "+sub.total +" ads"}</span></>)
//                                                                                       : (<span className='bg-blue-400'>{data.subName}<span className='text-gray-500 text-xs'>{" ⋆ "+0+" ads"}</span></span>)
//                                                                                      }
//                                                                                     </span>
//                                                                                 ))   
//                                                                                 : (<span className='pointer-events-none'>{data.subName}<span className='text-gray-500 text-xs'>{" ⋆ "+0+" ads"}</span></span>)
                                                                              
//                                                                              }


//                                                                             <CommandItem
//                                                                                 key={framework.value}
//                                                                                 value={framework.value}
//                                                                                 onSelect={(currentValue) => {
//                                                                                     setValue(currentValue === value ? "" : currentValue)
//                                                                                     setOpen(false)
//                                                                                 }}
//                                                                               >
//                                                                                 {framework.label}
//                                                                                 <Check
//                                                                                     className={cn(
//                                                                                     "ml-auto",
//                                                                                     queryData.sub_category === data.subName ? "opacity-100" : "opacity-0"
//                                                                                     )}
//                                                                                 />
//                                                                             </CommandItem>





//                                                                        <CommandItem
//                                                                             disabled
//                                                                             key={index}
//                                                                             value={data.subName}
//                                                                             onSelect={(currentValue) => {
//                                                                                 //setModelValue(currentValue === mobilePostData.brand ? "" : currentValue)
//                                                                                 setQueryData({...queryData, sub_category: currentValue === queryData.sub_category ? "" : currentValue })
//                                                                                 setSubOpen(false)
//                                                                             }}
//                                                                         >
//                                                                             {'Name to show is here'}
//                                                                             <Check
//                                                                                 className={cn(
//                                                                                     "ml-auto",
//                                                                                     queryData.sub_category === data.subName ? "opacity-100" : "opacity-0"
//                                                                                 )}
//                                                                             />
//                                                                         </CommandItem>











// //// Edit phones

// <Select
//     value={editPost.town}
//     onValueChange={(value) => {
//         setEditPost({
//             ...editPost,
//             town: value,
//         });
//     }}
//     >
        
//     </Select>










//  <section className="w-full h-full">
                            
//                         {/* <div className="w-full bg-emptyBuyLater bg-no-repeat bg-center h-72"></div>  */}
//                         {/* Second Grid Item  className=" grid auto-rows-min self-auto grid-cols-2 md:grid-cols-3 gap-1" */}
//                         { 
//                           ( list.isLoading && list.items.length === 0 ) ? (<div className="w-full min-h-40"> <BeatLoaderUI color={'blue'} /> </div>)  : 
                        
//                             ( <div className="w-full">
//                                 {/* <p className="mb-5 font-medium text-lg line-clamp-1">Mobile Phones in {queryData.region || 'Ghana'}{queryData.town ? ', '+queryData.town : ''}</p> */}
//                                   {
//                                     (list.items.length === 0 && metadata.hasMore === false  ) ? (<div className="w-full bg-emptyBuyLater bg-no-repeat bg-center h-72"></div>): 

//                                     (<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 w-full">  
//                                         {
//                                           list.items.map((phone) =>
//                                             ( 
//                                             <CardUi 
//                                                     key={phone.ads_id}
//                                                     id={`/mobilephones/${phone.ads_id}`}
//                                                     imageUrl={phone.images[0]}
//                                                     price={phone.price}
//                                                     title={phone.title}
//                                                     location={phone.region +", " + phone.town}
//                                                     condition={phone.condition}
//                                                     created_at={phone.created_at}
//                                                     isverifiedstore={phone.isverifiedstore}
//                                             />)
//                                             )
//                                         }
//                                     </div>)
//                                   }
//                                     <div className={!metadata.hasMore ? 'hidden' : 'block' } ref={ref}><BeatLoaderUI color={'blue'} /></div> 

//                             </div>)
//                         } 


//                 </section>