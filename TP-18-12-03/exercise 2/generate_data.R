generate_data<-function(k) 
{
  #construct a data set of 1000 elements in 500 dimension
  data<-matrix(nrow = 1000,ncol=500)

  #Construct mean vectors
  M<-matrix(data=0,ncol=k,nrow=500)
  for(i in (1:500)){
    q<-sample( (1:k),1)
    d<-sample( (1:3),1)
    M[i,q]<-d 
  }

  #Construct Covariance matrix
  Cov_list<-list()

  for(j in (1:k)){
    Cov_list[[j]]<-matrix(data=0,ncol=500,nrow=500)
    idx<-which(M[,j]!=0)
    Cov_list[[j]][idx,idx]<-0.3
  }

  true_class<-c()
  #Generate the data from above
  for (j in (1:1000)){
    r<-sample((1:k),1)
    true_class<-c(true_class,r)
    data[j,]<-mvrnorm(1,mu=M[,r],Sigma=Cov_list[[r]])
  }
  data<-abs(data)
  my_list <- list(data, true_class)
  return(my_list) 
}