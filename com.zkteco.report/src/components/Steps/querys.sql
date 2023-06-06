{tableColumn.map((el, index) => {
                            if (index % 50 === 0) {
                                return (
                                
                                        <Grid item xs={2} key={el+index}>                            
                                            <FormControlLabel
                                                key={el+index}                                    
                                                labelPlacement="end"
                                                control={<Checkbox size="small" id={el.column} onChange={handleCheckBox}/>}
                                                label={el.column}
                                                sx={{ fontSize: '0.825rem' }} 
                                            />
                                        </Grid>
                                
                                );
                            } else {
                                return (
                                        <Grid item xs={2} key={el+index}>                            
                                            <FormControlLabel                                    
                                                labelPlacement="end"
                                                key={index}
                                                control={<Checkbox size="small" key={index} id={el.column} onChange={handleCheckBox}/>}
                                                label={el.column}
                                                sx={{ fontSize: '0.825rem' }} 
                                            />
                                        </Grid>
                                );
                            }
                        })}